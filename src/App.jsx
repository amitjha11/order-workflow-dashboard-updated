import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  MapPin,
  Package,
  RotateCcw,
  Search,
  UserRound
} from "lucide-react";
import { getOrders } from "./services/orderService";
import StatusBadge from "./components/StatusBadge";

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function WorkflowStep({ number, title, description, state }) {
  return (
    <div className="workflow-step">
      <div className={`workflow-marker ${state}`}>
        {state === "completed" ? <CheckCircle2 size={17} /> : number}
      </div>
      <div className="workflow-step-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Unable to load order data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function searchOrder(event) {
    event?.preventDefault();

    const normalizedId = orderId.trim().toLowerCase();

    if (!normalizedId) {
      setOrder(null);
      setHasSearched(false);
      inputRef.current?.focus();
      return;
    }

    setSearching(true);
    setHasSearched(true);

    // Simulates the response time of a future API call.
    window.setTimeout(() => {
      const result = orders.find(
        (item) => item.orderId.toLowerCase() === normalizedId
      );

      setOrder(result || null);
      setSearching(false);
    }, 250);
  }

  function clearSearch() {
    setOrderId("");
    setOrder(null);
    setHasSearched(false);
    inputRef.current?.focus();
  }

  function loadDemoOrder(id) {
    setOrderId(id);
    window.setTimeout(() => {
      const result = orders.find((item) => item.orderId === id);
      setOrder(result || null);
      setHasSearched(true);
    }, 0);
  }

  const getWorkflowState = (step) => {
    if (order?.status === "Completed") return "completed";
    if (order?.status === "Failed" && step === 2) return "active";
    if (step === 1) return "completed";
    if (step === 2) return "active";
    return "upcoming";
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={21} />
          </div>
          <div>
            <strong>OrderFlow</strong>
            <span>Workflow Operations</span>
          </div>
        </div>

        <div className="environment-badge">
          <span />
          Demo environment
        </div>
      </header>

      <main className="lookup-page">
        <section className="lookup-hero">
          <div className="hero-icon">
            <Search size={23} />
          </div>
          <span className="eyebrow">Order tracking</span>
          <h1>Check order status</h1>
          <p>
            Enter an Order ID to retrieve the latest status and workflow
            information.
          </p>

          <form className="search-form" onSubmit={searchOrder}>
            <div className="order-search">
              <Search size={19} />
              <input
                ref={inputRef}
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="Enter Order ID, e.g. ORD-10001"
                aria-label="Order ID"
                autoComplete="off"
              />
              {orderId && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={clearSearch}
                  aria-label="Clear Order ID"
                >
                  ×
                </button>
              )}
            </div>
            <button
              className="search-button"
              type="submit"
              disabled={loading || searching}
            >
              {searching ? (
                <Clock3 size={17} className="spin" />
              ) : (
                <Search size={17} />
              )}
              {searching ? "Checking..." : "Search"}
            </button>
          </form>

          <div className="demo-hint">
            <span>Try a demo order:</span>
            <button onClick={() => loadDemoOrder("ORD-10001")}>ORD-10001</button>
            <button onClick={() => loadDemoOrder("ORD-10004")}>ORD-10004</button>
            <button onClick={() => loadDemoOrder("ORD-10009")}>ORD-10009</button>
          </div>
        </section>

        {error && (
          <section className="message-card error-card">
            <CircleAlert size={20} />
            <div>
              <strong>Unable to load order data</strong>
              <p>{error}</p>
            </div>
          </section>
        )}

        {hasSearched && !searching && !error && !order && (
          <section className="message-card not-found-card">
            <CircleAlert size={21} />
            <div>
              <strong>Order not found</strong>
              <p>
                No order was found for <b>{orderId}</b>. Check the Order ID and
                try again.
              </p>
            </div>
          </section>
        )}

        {order && !searching && (
          <section className="result-card">
            <div className="result-header">
              <div>
                <span className="eyebrow">Latest order status</span>
                <div className="order-title">
                  <h2>{order.orderId}</h2>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              <button className="new-search-button" onClick={clearSearch}>
                <RotateCcw size={15} />
                New search
              </button>
            </div>

            <div className="latest-status">
              <div className={`latest-status-icon status-icon-${order.status.toLowerCase()}`}>
                {order.status === "Completed" ? (
                  <CheckCircle2 size={24} />
                ) : order.status === "Failed" ? (
                  <CircleAlert size={24} />
                ) : (
                  <Clock3 size={24} />
                )}
              </div>
              <div>
                <span>Current workflow status</span>
                <strong>{order.workflowStep}</strong>
                <small>Last updated {formatDateTime(order.lastUpdated)}</small>
              </div>
            </div>

            <div className="result-divider" />

            <div className="info-grid">
              <div className="info-item">
                <UserRound size={18} />
                <div>
                  <span>Customer</span>
                  <strong>{order.customer}</strong>
                </div>
              </div>

              <div className="info-item">
                <Package size={18} />
                <div>
                  <span>Product</span>
                  <strong>{order.product}</strong>
                </div>
              </div>

              <div className="info-item">
                <Package size={18} />
                <div>
                  <span>Quantity</span>
                  <strong>{order.quantity}</strong>
                </div>
              </div>

              <div className="info-item">
                <MapPin size={18} />
                <div>
                  <span>Location</span>
                  <strong>{order.location}</strong>
                </div>
              </div>

              <div className="info-item">
                <CalendarDays size={18} />
                <div>
                  <span>Order date</span>
                  <strong>{formatDate(order.orderDate)}</strong>
                </div>
              </div>

              <div className="info-item">
                <Activity size={18} />
                <div>
                  <span>Order owner</span>
                  <strong>{order.owner}</strong>
                </div>
              </div>
            </div>

            <div className="result-divider" />

            <div className="workflow-section">
              <div className="section-heading">
                <div>
                  <h3>Workflow progress</h3>
                  <p>Current position of the order in the processing flow.</p>
                </div>
                <span className={`priority priority-${order.priority.toLowerCase()}`}>
                  {order.priority} priority
                </span>
              </div>

              <div className="workflow">
                <WorkflowStep
                  number="1"
                  title="Order received"
                  description="Order entered into workflow"
                  state={getWorkflowState(1)}
                />
                <div className={`workflow-connector ${order.status === "Pending" ? "" : "active"}`}>
                  <ArrowRight size={17} />
                </div>
                <WorkflowStep
                  number="2"
                  title="Processing"
                  description={order.status === "Failed" ? "Integration requires attention" : order.workflowStep}
                  state={getWorkflowState(2)}
                />
                <div className={`workflow-connector ${order.status === "Completed" ? "active" : ""}`}>
                  <ArrowRight size={17} />
                </div>
                <WorkflowStep
                  number="3"
                  title="Fulfilled"
                  description={order.status === "Completed" ? "Order successfully fulfilled" : "Awaiting completion"}
                  state={getWorkflowState(3)}
                />
              </div>
            </div>

            {order.status === "Failed" && (
              <div className="action-card">
                <CircleAlert size={20} />
                <div>
                  <strong>Action required</strong>
                  <p>
                    This order encountered an integration issue and requires
                    support before it can continue.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {!hasSearched && !loading && !error && (
          <section className="initial-state">
            <div className="initial-icon">
              <Package size={27} />
            </div>
            <h2>Search for an order</h2>
            <p>
              Enter an Order ID above to view its latest workflow status.
            </p>
          </section>
        )}

        <footer className="page-footer">
          <span>Data source: demo JSON</span>
          <span>For demonstration purposes only</span>
        </footer>
      </main>
    </div>
  );
}