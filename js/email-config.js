/*
  EMAILJS SETUP — NEW ORDER TEMPLATE
  ----------------------------------
  Template "To Email":
    {{to_email}}

  Suggested subject:
    Soon Bakery Order #{{order_id}}

  Variables supplied by order-confirmation.js:

    {{recipient_name}}
    {{order_id}}
    {{customer_name}}
    {{customer_contact}}
    {{customer_email}}

    {{collection_method}}
    {{collection_date}}
    {{address}}
    {{postal_code}}
    {{additional_notes}}

    {{#orders}}
      {{name}}
      {{units}}
      {{price}}
      {{unit_price}}
    {{/orders}}

    {{cost.delivery}}
    {{cost.total}}
    {{cost.deposit}}

  IMPORTANT:
  The "orders" array deliberately contains NO image field, so the email
  will not include product images unless you manually add an image to
  the EmailJS template itself.
*/

window.SOON_BAKERY_EMAILJS = {
  publicKey: "F_nRrpOW0YAt1BjQD",
  serviceId: "service_jy5szde",
  templateId: "template_order",
  adminEmail: "bakerysoon@gmail.com"
};
