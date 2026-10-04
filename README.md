# Order Workflow Status Dashboard

A React/Vite demonstration UI for looking up the latest status of a single order.

## User flow

1. Enter an Order ID.
2. Click Search or press Enter.
3. The dashboard returns the matching order's latest status.
4. The result shows order information and workflow progress.

There is no order list/table in the UI.

## Run locally

```bash
npm install
npm run dev
```

If you prefer `npm start`, add `"start": "vite"` to the scripts in package.json.

## Demo data

Demo orders are stored in:

`public/data/orders.json`

Try:

- `ORD-10001` — Completed
- `ORD-10004` — Failed
- `ORD-10009` — Processing

## Future Boomi integration

The UI calls:

`src/services/orderService.js`

Currently it loads the JSON file and performs the lookup in the browser.

When the Boomi API is available, change `getOrders()` to call the API. Prefer an endpoint shaped around the actual use case, for example:

```text
GET /orders/{orderId}
```

The UI can then receive one order instead of downloading all orders.

Do not put credentials, API keys, tokens, or sensitive production data in the GitHub repository.
