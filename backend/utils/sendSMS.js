//FOR QUICK SMS MODE

import axios from "axios";

const FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2";

export const sendSMS = async (phone, message) => {
  // clean the number: keep the last 10 digits (handles +91, 91, spaces)
  const number = String(phone || "").replace(/\D/g, "").slice(-10);
  if (!/^[6-9]\d{9}$/.test(number)) {
    throw new Error(`Invalid phone number: ${phone}`);
  }

  // MOCK MODE: no provider call, no cost
  if (process.env.SMS_MODE === "mock") {
    return { success: true, mock: true, to: number, length: message.length };
  }

  // REAL MODE: Fast2SMS
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) throw new Error("FAST2SMS_API_KEY is missing in .env");

  try {
    const res = await axios.post(
      FAST2SMS_URL,
      { route: "q", message, language: "english", numbers: number },
      { headers: { authorization: apiKey }, timeout: 15000 }
    );

    if (res.data?.return !== true) {
      throw new Error(
        Array.isArray(res.data?.message)
          ? res.data.message.join(", ")
          : res.data?.message || "Fast2SMS rejected the request"
      );
    }
    return { success: true, requestId: res.data.request_id };
  } catch (err) {
    const detail = err.response?.data?.message || err.message;
    throw new Error(Array.isArray(detail) ? detail.join(", ") : String(detail));
  }
};


// FOR DLT MODE

// import axios from "axios";
// import { SMS_TEMPLATES, renderTemplate } from "./smsTemplates.js";

// const FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2";

// export const sendSMS = async (phone, templateName, variables = []) => {
//   // clean the number: keep the last 10 digits (handles +91, 91, spaces)
//   const number = String(phone || "").replace(/\D/g, "").slice(-10);
//   if (!/^[6-9]\d{9}$/.test(number)) {
//     throw new Error(`Invalid phone number: ${phone}`);
//   }

//   const template = SMS_TEMPLATES[templateName];
//   if (!template) throw new Error(`Unknown SMS template: ${templateName}`);

//   // "|" separates values in the DLT request, so remove it from the data
//   const values = variables.map((v) => String(v ?? "").replace(/\|/g, " ").trim());

//   const expected = (template.text.match(/\{#var#\}/g) || []).length;
//   if (values.length !== expected) {
//     throw new Error(
//       `Template "${templateName}" needs ${expected} values, got ${values.length}`
//     );
//   }

//   const message = renderTemplate(templateName, values);
//   const route = (process.env.SMS_ROUTE || "quick").toLowerCase();

//   // MOCK MODE: no provider call, no cost
//   if (process.env.SMS_MODE === "mock") {
//     return { success: true, mock: true, route, to: number, length: message.length, message };
//   }

//   const apiKey = process.env.FAST2SMS_API_KEY;
//   if (!apiKey) throw new Error("FAST2SMS_API_KEY is missing in .env");

//   try {
//     let res;

//     if (route === "dlt") {
//       const senderId = process.env.SMS_SENDER_ID;
//       const templateId = process.env[template.idEnv];
//       if (!senderId) throw new Error("SMS_SENDER_ID is missing in .env");
//       if (!templateId) throw new Error(`${template.idEnv} is missing in .env`);

//       res = await axios.get(FAST2SMS_URL, {
//         params: {
//           route: "dlt",
//           sender_id: senderId,
//           message: templateId,             // approved template ID, not the text
//           variables_values: values.join("|"),
//           numbers: number,
//         },
//         headers: { authorization: apiKey },
//         timeout: 15000,
//       });
//     } else {
//       res = await axios.post(
//         FAST2SMS_URL,
//         { route: "q", message, language: "english", numbers: number },
//         { headers: { authorization: apiKey }, timeout: 15000 }
//       );
//     }

//     if (res.data?.return !== true) {
//       throw new Error(
//         Array.isArray(res.data?.message)
//           ? res.data.message.join(", ")
//           : res.data?.message || "Fast2SMS rejected the request"
//       );
//     }
//     return { success: true, route, requestId: res.data.request_id };
//   } catch (err) {
//     const detail = err.response?.data?.message || err.message;
//     throw new Error(Array.isArray(detail) ? detail.join(", ") : String(detail));
//   }
// };