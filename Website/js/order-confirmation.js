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
  return subtotal <= 100 ? 10 : 0;
}

function getPricing(cart) {
  const subtotal = getCartSubtotal(cart);
  const deliveryRequired = window.SoonBakeryCart.getDeliveryRequired();
  const deliveryFee = getDeliveryFee(subtotal, deliveryRequired);

  return {
    subtotal,
    deliveryRequired,
    deliveryFee,
    total: subtotal + deliveryFee
  };
}

function configureDeliveryFields() {
  const deliveryRequired = window.SoonBakeryCart.getDeliveryRequired();
  const fields = [
    document.querySelector("#delivery-address"),
    document.querySelector("#delivery-postal-code"),
    // document.querySelector("#delivery-date")
  ].filter(Boolean);
  const status = document.querySelector("#delivery-fields-status");
  const requiredMarks = document.querySelectorAll(".delivery-only-required-mark");

  fields.forEach((field) => {
    field.disabled = !deliveryRequired;
    field.required = deliveryRequired;
  });

  requiredMarks.forEach((mark) => {
    mark.hidden = !deliveryRequired;
  });

  if (status) {
    status.textContent = deliveryRequired
      ? "Delivery was selected in your cart. Please provide your address, postal code, and delivery date."
      : "Delivery was not selected. Address and postal code are inactive; please select your pick-up date.";

    status.classList.toggle("is-required", deliveryRequired);
  }

  const deliveryDate = document.querySelector("#delivery-date");
  if (deliveryDate) {
    deliveryDate.disabled = false;
    deliveryDate.required = true;

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    deliveryDate.min = localDate;
  }
}

function renderOrderReview() {
  const container = document.querySelector("#confirmation-order-items");
  const subtotalEl = document.querySelector("#confirmation-subtotal");
  const deliveryRow = document.querySelector("#confirmation-delivery-row");
  const deliveryEl = document.querySelector("#confirmation-delivery");
  const totalEl = document.querySelector("#confirmation-total");
  const cart = window.SoonBakeryCart.getItems();

  if (!container || !subtotalEl || !totalEl) return;

  if (!cart.length) {
    window.location.replace("checkout.html");
    return;
  }

  container.innerHTML = cart.map((item) => `
    <div class="confirmation-order-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="confirmation-order-copy">
        <strong>${item.name}</strong>
        <span>Qty: ${item.quantity}</span>
      </div>
      <span>${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join("");

  const pricing = getPricing(cart);
  subtotalEl.textContent = formatCurrency(pricing.subtotal);
  totalEl.textContent = formatCurrency(pricing.total);

  if (deliveryRow) deliveryRow.hidden = !pricing.deliveryRequired;
  if (deliveryEl) {
    deliveryEl.textContent = pricing.deliveryRequired && pricing.subtotal > 100
      ? "FREE"
      : formatCurrency(pricing.deliveryFee);
  }
}

function createOrderId() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SB-${date}-${suffix}`;
}

function buildItemDetails(cart) {
  return cart
    .map((item) => `${item.name} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}`)
    .join("\n");
}

function buildDeliveryDetails(order) {
  if (!order.delivery.required) {
    return [
      "Fulfilment: Self-collection",
      `Pick-up date: ${order.delivery.date}`
    ].join("\n");
  }

  const deliveryCharge = order.delivery.fee === 0 ? "FREE" : formatCurrency(order.delivery.fee);
  return [
    "Fulfilment: Delivery",
    `Delivery charge: ${deliveryCharge}`,
    `Delivery address: ${order.delivery.address}`,
    `Postal code: ${order.delivery.postalCode}`,
    `Delivery date: ${order.delivery.date}`
  ].join("\n");
}

function buildOrderDetails(order) {
  return [
    buildItemDetails(order.items),
    "",
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    buildDeliveryDetails(order),
    `Total: ${formatCurrency(order.total)}`,
    "",
    `Additional notes: ${order.additionalNotes || "None"}`
  ].join("\n");
}

function emailConfigReady(config) {
  if (!config) return false;
  return [config.publicKey, config.serviceId, config.templateId].every(
    (value) => value && !String(value).startsWith("YOUR_")
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendOrderEmail(toEmail, recipientName, order, config) {
  const params = {
    to_email: toEmail,
    recipient_name: recipientName,
    order_id: order.orderId,
    customer_name: order.customer.name,
    customer_contact: order.customer.contact,
    customer_email: order.customer.email,
    order_details: buildOrderDetails(order),
    order_subtotal: formatCurrency(order.subtotal),
    delivery_required: order.delivery.required ? "Yes" : "No",
    delivery_fee: order.delivery.required
      ? (order.delivery.fee === 0 ? "FREE" : formatCurrency(order.delivery.fee))
      : "Not applicable",
    delivery_address: order.delivery.required ? order.delivery.address : "Not applicable",
    delivery_postal_code: order.delivery.required ? order.delivery.postalCode : "Not applicable",
    delivery_date: order.delivery.date,
    delivery_details: buildDeliveryDetails(order),
    additional_notes: order.additionalNotes || "None",
    order_total: formatCurrency(order.total),
    submitted_at: order.submittedAt,
    payment_notice: "No payment has been collected. This email acknowledges an order request only."
  };

  return window.emailjs.send(
    config.serviceId,
    config.templateId,
    params,
    { publicKey: config.publicKey }
  );
}

function setSubmissionState(isSubmitting) {
  const button = document.querySelector("#submit-order-btn");
  if (!button) return;
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "SUBMITTING..." : "SUBMIT ORDER REQUEST";
}

function showFormMessage(message) {
  const messageEl = document.querySelector("#order-form-message");
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.hidden = !message;
}

async function handleOrderSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  const cart = window.SoonBakeryCart.getItems();
  if (!cart.length) {
    window.location.replace("checkout.html");
    return;
  }

  const config = window.SOON_BAKERY_EMAILJS;
  if (!emailConfigReady(config)) {
    showFormMessage(
      "Email sending is not configured yet. Add your EmailJS Public Key, Service ID and Template ID in js/email-config.js before accepting live orders."
    );
    return;
  }

  if (!window.emailjs) {
    showFormMessage("The email service could not load. Please check your internet connection and try again.");
    return;
  }

  showFormMessage("");
  setSubmissionState(true);

  const formData = new FormData(form);
  const pricing = getPricing(cart);
  const order = {
    orderId: createOrderId(),
    customer: {
      name: String(formData.get("name") || "").trim(),
      contact: String(formData.get("contact") || "").trim(),
      email: String(formData.get("email") || "").trim()
    },
    delivery: {
      required: pricing.deliveryRequired,
      fee: pricing.deliveryFee,
      address: pricing.deliveryRequired ? String(formData.get("address") || "").trim() : "",
      postalCode: pricing.deliveryRequired ? String(formData.get("postalCode") || "").trim() : "",
      date: String(formData.get("deliveryDate") || "").trim()
    },
    additionalNotes: String(formData.get("additionalNotes") || "").trim(),
    items: cart,
    subtotal: pricing.subtotal,
    total: pricing.total,
    submittedAt: new Intl.DateTimeFormat("en-SG", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Singapore"
    }).format(new Date())
  };

  try {
    // EmailJS currently limits the send endpoint to one request per second,
    // so the two invoice emails are sent sequentially with a short pause.
    await sendOrderEmail(config.adminEmail, "Soon Bakery", order, config);
    await wait(1100);
    await sendOrderEmail(order.customer.email, order.customer.name, order, config);

    sessionStorage.setItem("soonBakeryLastOrder", JSON.stringify(order));
    window.SoonBakeryCart.clearCart();
    window.SoonBakeryCart.clearDeliveryPreference();
    window.location.href = "order-submitted.html";
  } catch (error) {
    console.error("Could not submit order:", error);
    showFormMessage(
      "Your order was not submitted because the confirmation email could not be sent. Please try again. Your cart has not been cleared."
    );
    setSubmissionState(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  configureDeliveryFields();
  renderOrderReview();
  const form = document.querySelector("#customer-details-form");
  form?.addEventListener("submit", handleOrderSubmit);
});
