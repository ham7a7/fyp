import axios from "axios";
import crypto from "crypto";

const GRAPH_API_URL = "https://graph.facebook.com/v25.0";
// WhatsApp's maximum length for one text message
const TEXT_LIMIT = 4096;

const callWhatsAppApi = async (
  phoneNumberId: string,
  accessToken: string,
  payload: Record<string, unknown>,
) => {
  try {
    return await axios.post(
      `${GRAPH_API_URL}/${phoneNumberId}/messages`,
      { messaging_product: "whatsapp", ...payload },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  } catch (error: any) {
    // Include Meta's explanation (e.g. "access token has expired"), not just the status code
    const metaError = error.response?.data?.error;
    throw new Error(
      metaError
        ? `WhatsApp API error ${error.response.status}: ${metaError.message}`
        : error.message,
    );
  }
};

// Asks Meta for the phone number's details, to catch a wrong phone number ID or an
// invalid/expired token when the settings are saved. Returns Meta's error, or null if fine
export const checkWhatsAppCredentials = async (
  phoneNumberId: string,
  accessToken: string,
): Promise<string | null> => {
  try {
    await axios.get(`${GRAPH_API_URL}/${phoneNumberId}`, {
      params: { fields: "display_phone_number" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return null;
  } catch (error: any) {
    return error.response?.data?.error?.message ?? error.message;
  }
};

// Long answers are split into several messages
export const sendWhatsAppText = async (
  phoneNumberId: string,
  accessToken: string,
  to: string,
  text: string,
) => {
  for (let start = 0; start < text.length; start += TEXT_LIMIT) {
    await callWhatsAppApi(phoneNumberId, accessToken, {
      recipient_type: "individual",
      to,
      type: "text",
      text: { body: text.slice(start, start + TEXT_LIMIT), preview_url: false },
    });
  }
};

// Shows the message as read (blue ticks) and "typing..." until the reply is sent
export const markAsReadAndTyping = (
  phoneNumberId: string,
  accessToken: string,
  messageId: string,
) =>
  callWhatsAppApi(phoneNumberId, accessToken, {
    status: "read",
    message_id: messageId,
    typing_indicator: { type: "text" },
  });

// Meta signs every webhook request with the app secret, so fake requests can be rejected
export const isValidSignature = (
  rawBody: Buffer | undefined,
  signature: string | undefined,
  appSecret: string,
) => {
  if (!rawBody || !signature) return false;

  const expected = `sha256=${crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex")}`;

  return (
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  );
};

// Safety net in case the model still answers with Markdown
export const toWhatsAppText = (text: string) =>
  text
    .replace(/\*\*(.+?)\*\*/g, "*$1*") // **bold** -> *bold*
    .replace(/^#{1,6}\s+/gm, "") // remove headings
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1: $2"); // [text](url) -> text: url
