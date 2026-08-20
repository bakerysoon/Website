function formatCurrency(value) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD"
  }).format(value);
}

function getCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getDeliveryFee(subtotal, deliveryRequired) {
  if (!deliveryRequired) return 0;
  return subtotal <= 150 ? 10 : 0;
}

function renderCheckoutCart() {
  const container = document.querySelector("#checkout-cart-items");
  const emptyState = document.querySelector("#checkout-empty");
  const summary = document.querySelector("#checkout-summary");
  const deliveryCheckbox = document.querySelector("#delivery-required");
  const deliveryLine = document.querySelector("#checkout-delivery-line");
  const deliveryAmount = document.querySelector("#checkout-delivery");

  if (!container || !emptyState || !summary) return;

  const cart = window.SoonBakeryCart.getItems();

  if (cart.length === 0) {
    container.innerHTML = "";
    emptyState.hidden = false;
    summary.hidden = true;
    window.SoonBakeryCart.setDeliveryRequired(false);
    if (deliveryCheckbox) deliveryCheckbox.checked = false;
    return;
  }

  emptyState.hidden = true;
  summary.hidden = false;

  container.innerHTML = cart
    .map(
      (item) => `
        <article class="checkout-item" data-product-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
          <div class="checkout-item-details">
            <h3>${item.name}</h3>
            <p>${formatCurrency(item.price)}</p>
            <button type="button" class="checkout-remove" data-action="remove">Remove</button>
          </div>
          <div class="checkout-quantity" aria-label="Quantity for ${item.name}">
            <button type="button" data-action="decrease" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" aria-label="Increase quantity">+</button>
          </div>
          <p class="checkout-line-total">${formatCurrency(item.price * item.quantity)}</p>
        </article>
      `
    )
    .join("");

  const subtotal = getCartSubtotal(cart);
  const deliveryRequired = window.SoonBakeryCart.getDeliveryRequired();
  const deliveryFee = getDeliveryFee(subtotal, deliveryRequired);
  const total = subtotal + deliveryFee;

  if (deliveryCheckbox) deliveryCheckbox.checked = deliveryRequired;
  if (deliveryLine) deliveryLine.hidden = !deliveryRequired;
  if (deliveryAmount) {
    deliveryAmount.textContent = deliveryRequired && subtotal > 150
      ? "FREE"
      : formatCurrency(deliveryFee);
  }

  document.querySelector("#checkout-subtotal").textContent = formatCurrency(subtotal);
  document.querySelector("#checkout-total").textContent = formatCurrency(total);
}

function setupCheckoutActions() {
  const container = document.querySelector("#checkout-cart-items");
  const deliveryCheckbox = document.querySelector("#delivery-required");

  if (container) {
    container.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;

      const row = button.closest(".checkout-item");
      const productId = row?.dataset.productId;
      if (!productId) return;

      const item = window.SoonBakeryCart.getItems().find((cartItem) => cartItem.id === productId);
      if (!item) return;

      if (button.dataset.action === "increase") {
        window.SoonBakeryCart.setItemQuantity(productId, item.quantity + 1);
      }

      if (button.dataset.action === "decrease") {
        window.SoonBakeryCart.setItemQuantity(productId, item.quantity - 1);
      }

      if (button.dataset.action === "remove") {
        window.SoonBakeryCart.removeItem(productId);
      }
    });
  }

  deliveryCheckbox?.addEventListener("change", () => {
    window.SoonBakeryCart.setDeliveryRequired(deliveryCheckbox.checked);
    renderCheckoutCart();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutCart();
  setupCheckoutActions();
});

window.addEventListener("soonbakery:cart-updated", renderCheckoutCart);
window.addEventListener("soonbakery:delivery-updated", renderCheckoutCart);
