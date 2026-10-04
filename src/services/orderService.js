const DATA_URL = "./data/orders.json";

export async function getOrders() {
  const response = await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error(`Unable to load orders: ${response.status}`);
  }

  const data = await response.json();
  return data.orders ?? [];
}

/*
  Future Boomi integration:
  Replace DATA_URL with the Boomi endpoint, or change this function to call it.
  Keep the returned object normalized to the same order shape used by the UI.
*/