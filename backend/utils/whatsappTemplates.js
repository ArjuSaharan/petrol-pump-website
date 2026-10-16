export const WA_TEMPLATES = {
  fuelReceipt: {
    name: "fuel_receipt", // the template name you register in Meta
    text: "Hello {{1}}, fuel receipt added: {{2}}, Rs {{3}}, Vehicle {{4}}, Payment {{5}}. Thank you.",
  },
  paymentReceived: {
    name: "payment_received",
    text: "Dear {{1}}, payment of Rs {{2}} received on {{3}} via {{4}}. Pending amount: Rs {{5}}. Thank you.",
  },
};

export const renderWaTemplate = (key, variables) => {
  const t = WA_TEMPLATES[key];
  if (!t) throw new Error(`Unknown WhatsApp template: ${key}`);
  return t.text.replace(/\{\{(\d+)\}\}/g, (_, n) => String(variables[n - 1] ?? ""));
};