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
    deliveryEl.textContent = pricing.deliveryRequired && pricing.subtotal > 150
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


function formatDateForEmail(dateString) {
  if (!dateString) return "Not specified";

  const parts = String(dateString).split("-");
  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function buildEmailOrders(items) {
  return items.map((item) => ({
    name: item.name,
    units: item.quantity,
    // This is the line total, not the unit price.
    // The EmailJS template can display it as: ${{price}}
    price: (item.price * item.quantity).toFixed(2),
    unit_price: Number(item.price).toFixed(2)
  }));
}

function buildEmailCost(order) {
  const deliveryFee = Number(order.delivery.fee || 0);
  const total = Number(order.total || 0);
  const deposit = total * 0.5;

  return {
    // Keep these as number-looking strings because the EmailJS template
    // already places a "$" before the variable.
    delivery: deliveryFee.toFixed(2),
    total: total.toFixed(2),
    deposit: deposit.toFixed(2)
  };
}

function getCollectionMethod(order) {
  return order.delivery.required ? "Delivery" : "Self-Collection";
}

function getEmailAddress(order) {
  if (!order.delivery.required) return "Not applicable";

  const parts = [
    order.delivery.address,
    order.delivery.postalCode ? `Singapore ${order.delivery.postalCode}` : ""
  ].filter(Boolean);

  return parts.join(", ");
}

async function sendOrderEmail(toEmail, recipientName, order, config) {
  const collectionMethod = getCollectionMethod(order);
  const collectionDate = formatDateForEmail(order.delivery.date);
  const address = getEmailAddress(order);
  const orders = buildEmailOrders(order.items);
  const cost = buildEmailCost(order);

  const params = {
    // Email routing
    to_email: toEmail,
    recipient_name: recipientName,

    // Order / customer details
    order_id: order.orderId,
    customer_name: order.customer.name,
    customer_contact: order.customer.contact,
    customer_email: order.customer.email,

    // New template variables
    collection_method: collectionMethod,
    collection_date: collectionDate,
    address: address,
    postal_code: order.delivery.required ? order.delivery.postalCode : "Not applicable",
    additional_notes: order.additionalNotes || "None",

    // EmailJS supports looping over arrays with {{#orders}} ... {{/orders}}
    // No image URL is included here, so product images are not sent to the template.
    orders: orders,

    // Nested object, used as {{cost.delivery}}, {{cost.total}}, {{cost.deposit}}
    cost: cost,

    // Extra aliases kept for flexibility / backwards compatibility
    fulfilment_method: collectionMethod,
    fulfilment_date: collectionDate,
    delivery_required: order.delivery.required ? "Yes" : "No",
    delivery_fee: order.delivery.required
      ? (order.delivery.fee === 0 ? "FREE" : formatCurrency(order.delivery.fee))
      : "Not applicable",
    delivery_address: order.delivery.required ? order.delivery.address : "Not applicable",
    delivery_postal_code: order.delivery.required ? order.delivery.postalCode : "Not applicable",
    delivery_date: collectionDate,
    order_subtotal: formatCurrency(order.subtotal),
    order_total: formatCurrency(order.total),
    deposit_amount: formatCurrency(order.total * 0.5),
    order_details: buildOrderDetails(order),
    delivery_details: buildDeliveryDetails(order),
    submitted_at: order.submittedAt,
    payment_notice: "No payment has been collected on this website. Payment instructions will be sent separately."
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


function getFieldLabel(field) {
  const labels = {
    name: "Name",
    contact: "Contact Number",
    email: "Email",
    address: "Address",
    postalCode: "Postal Code",
    deliveryDate: "Delivery/Pick-Up Date",
    additionalNotes: "Additional Notes"
  };

  return labels[field.name] || field.name || "This field";
}

function getFieldError(field) {
  const label = getFieldLabel(field);

  if (field.validity.valueMissing) {
    const messages = {
      name: "Please enter your name.",
      contact: "Please enter your contact number.",
      email: "Please enter your email address.",
      address: "Please enter your delivery address.",
      postalCode: "Please enter your postal code.",
      deliveryDate: "Please select a delivery/pick-up date."
    };
    return messages[field.name] || `Please complete ${label}.`;
  }

  if (field.validity.typeMismatch && field.name === "email") {
    return "Please enter a valid email address, for example name@example.com.";
  }

  if (field.validity.patternMismatch) {
    if (field.name === "contact") {
      return "Please enter a valid contact number using 7 to 24 characters (numbers, spaces, +, brackets or hyphens).";
    }
    if (field.name === "postalCode") {
      return "Please enter a valid 6-digit Singapore postal code.";
    }
    return `${label} is not in the correct format.`;
  }

  if (field.validity.rangeUnderflow && field.name === "deliveryDate") {
    return "Please select today or a later date for delivery/pick-up.";
  }

  if (field.validity.tooLong) {
    return `${label} is too long. Please shorten your entry.`;
  }

  if (field.validity.badInput) {
    return `Please check the value entered for ${label}.`;
  }

  if (!field.validity.valid) {
    return `Please check ${label} and try again.`;
  }

  return "";
}

function getFormValidationErrors(form) {
  const fields = [...form.querySelectorAll("input, textarea, select")]
    .filter((field) => !field.disabled);

  return fields
    .filter((field) => !field.validity.valid)
    .map((field) => ({
      field,
      message: getFieldError(field)
    }))
    .filter((item) => item.message);
}

function ensureValidationPopup() {
  let popup = document.querySelector("#validation-popup");
  if (popup) return popup;

  popup = document.createElement("div");
  popup.id = "validation-popup";
  popup.className = "validation-popup";
  popup.setAttribute("aria-hidden", "true");

  popup.innerHTML = `
    <div class="validation-popup-backdrop" data-validation-close></div>
    <section
      class="validation-popup-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="validation-popup-title"
    >
      <button
        type="button"
        class="validation-popup-close"
        data-validation-close
        aria-label="Close"
      >×</button>

      <p class="validation-popup-eyebrow">Please check your details</p>
      <h2 id="validation-popup-title">We couldn't submit your order yet</h2>
      <p class="validation-popup-copy">Please correct the following:</p>
      <ul class="validation-popup-errors"></ul>
      <button type="button" class="validation-popup-ok" data-validation-close>OK</button>
    </section>
  `;

  document.body.appendChild(popup);

  popup.addEventListener("click", (event) => {
    if (event.target.closest("[data-validation-close]")) {
      closeValidationPopup();
    }
  });

  return popup;
}

let validationPopupFocusTarget = null;

function showValidationPopup(errors) {
  const popup = ensureValidationPopup();
  const list = popup.querySelector(".validation-popup-errors");

  list.innerHTML = errors
    .map((error) => `<li>${error.message}</li>`)
    .join("");

  validationPopupFocusTarget = errors[0]?.field || null;
  popup.classList.add("is-open");
  popup.setAttribute("aria-hidden", "false");
  document.body.classList.add("validation-popup-open");

  window.requestAnimationFrame(() => {
    popup.querySelector(".validation-popup-ok")?.focus();
  });
}

function closeValidationPopup() {
  const popup = document.querySelector("#validation-popup");
  if (!popup) return;

  popup.classList.remove("is-open");
  popup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("validation-popup-open");

  if (validationPopupFocusTarget) {
    validationPopupFocusTarget.focus();
    validationPopupFocusTarget.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  validationPopupFocusTarget = null;
}

async function handleOrderSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;

  const validationErrors = getFormValidationErrors(form);
  if (validationErrors.length) {
    showValidationPopup(validationErrors);
    return;
  }

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
    await sendOrderEmail(
      config.adminEmail,
      "Soon Bakery",
      order,
      config
    );
  
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

  // Suppress browser-native validation bubbles so customers see the custom popup instead.
  form?.addEventListener("invalid", (event) => {
    event.preventDefault();
  }, true);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.querySelector("#validation-popup")?.classList.contains("is-open")) {
    closeValidationPopup();
  }
});
