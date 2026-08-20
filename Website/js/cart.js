const CART_STORAGE_KEY = "soonBakeryCart";
const DELIVERY_STORAGE_KEY = "soonBakeryDeliveryRequired";

function readCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.warn("Could not read cart from localStorage:", error);
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
  window.dispatchEvent(new CustomEvent("soonbakery:cart-updated", { detail: cart }));
}


function getDeliveryRequired() {
  return localStorage.getItem(DELIVERY_STORAGE_KEY) === "true";
}

function setDeliveryRequired(required) {
  const nextValue = Boolean(required);
  if (getDeliveryRequired() === nextValue) return;
  localStorage.setItem(DELIVERY_STORAGE_KEY, String(nextValue));
  window.dispatchEvent(new CustomEvent("soonbakery:delivery-updated", { detail: nextValue }));
}

function clearDeliveryPreference() {
  const hadDeliveryPreference = getDeliveryRequired();
  localStorage.removeItem(DELIVERY_STORAGE_KEY);
  if (hadDeliveryPreference) {
    window.dispatchEvent(new CustomEvent("soonbakery:delivery-updated", { detail: false }));
  }
}

function getCartCount() {
  return readCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll(".cart-count").forEach((badge) => {
    badge.textContent = count;
    badge.setAttribute("aria-label", `${count} item${count === 1 ? "" : "s"} in cart`);
  });
}

function showCartToast(message = "Added to cart") {
  let toast = document.querySelector("#cart-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.className = "cart-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("is-visible");
  void toast.offsetWidth;
  toast.classList.add("is-visible");

  clearTimeout(showCartToast.timeoutId);
  showCartToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function addItem(product, quantity = 1) {
  const cart = readCart();
  const amountToAdd = Math.max(1, Number.parseInt(quantity, 10) || 1);
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += amountToAdd;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || "",
      quantity: amountToAdd
    });
  }

  writeCart(cart);
  showCartToast("Added to cart");
}

function setItemQuantity(productId, quantity) {
  const cart = readCart();
  const nextQuantity = Number.parseInt(quantity, 10) || 0;
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) return;

  if (nextQuantity <= 0) {
    removeItem(productId);
    return;
  }

  item.quantity = nextQuantity;
  writeCart(cart);
}

function removeItem(productId) {
  const nextCart = readCart().filter((item) => item.id !== productId);
  writeCart(nextCart);
}

function clearCart() {
  writeCart([]);
}

window.SoonBakeryCart = {
  getItems: readCart,
  getCount: getCartCount,
  addItem,
  setItemQuantity,
  removeItem,
  clearCart,
  getDeliveryRequired,
  setDeliveryRequired,
  clearDeliveryPreference,
  updateCartCount,
  showMessage: showCartToast
};

document.addEventListener("DOMContentLoaded", updateCartCount);
window.addEventListener("storage", updateCartCount);
