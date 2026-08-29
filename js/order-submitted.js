function formatCurrency(value) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD"
  }).format(value);
}

document.addEventListener("DOMContentLoaded", () => {
  const rawOrder = sessionStorage.getItem("soonBakeryLastOrder");
  const details = document.querySelector("#submitted-order-details");

  if (!rawOrder || !details) return;

  try {
    const order = JSON.parse(rawOrder);
    document.querySelector("#submitted-order-id").textContent = order.orderId || "—";
    document.querySelector("#submitted-email").textContent = order.customer?.email || "—";
    document.querySelector("#submitted-total").textContent = formatCurrency(order.total || 0);
    details.hidden = false;
  } catch (error) {
    console.warn("Could not read submitted order:", error);
  }
});
