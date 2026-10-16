export const SMS_TEMPLATES = {
  fuelReceipt: {
    idEnv: "SMS_TEMPLATE_FUEL_RECEIPT",
    text: "Hello {#var#}, fuel receipt added: {#var#}, Rs {#var#}, Vehicle {#var#}, Payment {#var#}. Thank you.",
  },
  paymentReceived: {
    idEnv: "SMS_TEMPLATE_PAYMENT",
    text: "Dear {#var#}, payment of Rs {#var#} received on {#var#} via {#var#}. Pending amount: Rs {#var#}. Thank you.",
  },
};

export const renderTemplate = (name, variables) => {
  const template = SMS_TEMPLATES[name];
  if (!template) throw new Error(`Unknown SMS template: ${name}`);
  let i = 0;
  return template.text.replace(/\{#var#\}/g, () => String(variables[i++] ?? ""));
};