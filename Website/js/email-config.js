/*
  EMAIL SETUP
  -----------
  Create a free EmailJS account, connect the Gmail/email account you want
  to send from, and create ONE template. Then replace the three placeholder
  values below with the IDs from your EmailJS dashboard.

  The template's "To Email" field should be: {{to_email}}
  Suggested subject: Soon Bakery Order Request {{order_id}}

  Suggested template body variables:
    {{recipient_name}}
    {{order_id}}
    {{customer_name}}
    {{customer_contact}}
    {{customer_email}}
    {{order_details}}
    {{order_total}}
    {{submitted_at}}
    {{payment_notice}}
*/

window.SOON_BAKERY_EMAILJS = {
  publicKey: "F_nRrpOW0YAt1BjQD",
  serviceId: "service_jy5szde",
  templateId: "template_order",
  adminEmail: "bakerysoon@gmail.com"
};
