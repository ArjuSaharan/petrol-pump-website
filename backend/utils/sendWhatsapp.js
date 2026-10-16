import axios from "axios";
import { WA_TEMPLATES, renderWaTemplate } from "./whatsappTemplates.js";

export const sendWhatsApp = async (phone, templateKey, variables = []) => {
  const number = String(phone || "").replace(/\D/g, "").slice(-10);
  if (!/^[6-9]\d{9}$/.test(number)) {
    throw new Error(`Invalid phone number: ${phone}`);
  }

  const template = WA_TEMPLATES[templateKey];
  if (!template) throw new Error(`Unknown WhatsApp template: ${templateKey}`);

  // Meta does not allow line breaks or tabs inside template values
  const values = variables.map((v) => String(v ?? "").replace(/[\r\n\t]+/g, " ").trim());
  const message = renderWaTemplate(templateKey, values);
  const link = `https://wa.me/91${number}?text=${encodeURIComponent(message)}`;
  console.log(`WhatsApp message to ${number}: ${message} (link: ${link})`);

  // LINK MODE (default): nothing is sent, you get the text and a click-to-send link
  if ((process.env.WA_MODE || "link") !== "api") {
    return { success: true, mode: "link", to: number, message, link };
  }

  // API MODE: official WhatsApp Cloud API
  const { WA_PHONE_NUMBER_ID, WA_ACCESS_TOKEN, WA_API_VERSION = "v21.0" } = process.env;
  if (!WA_PHONE_NUMBER_ID || !WA_ACCESS_TOKEN) {
    throw new Error("WA_PHONE_NUMBER_ID or WA_ACCESS_TOKEN is missing in .env");
  }

  try {
    const res = await axios.post(
      `https://graph.facebook.com/${WA_API_VERSION}/${WA_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: `91${number}`,
        type: "template",
        template: {
          name: template.name,
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: values.map((v) => ({ type: "text", text: v })),
            },
          ],
        },
      },
      { headers: { Authorization: `Bearer ${WA_ACCESS_TOKEN}` }, timeout: 15000 }
    );
    return { success: true, mode: "api", messageId: res.data?.messages?.[0]?.id, message, link };
  } catch (err) {
    throw new Error(err.response?.data?.error?.message || err.message);
  }
};