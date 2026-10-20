import type { Request, Response } from "express";
import mongoose from "mongoose";
import BotModel from "../database/schemas/bot.js";
import type { UpdateWhatsAppSettingsDto } from "../dtos/whatsapp.dto.js";
import type { IBotModel } from "../types/botModel.js";
import { generateReply } from "../utils/chatUtils.js";
import { decrypt, encrypt, generateKey } from "../utils/cryptoUtils.js";
import { findRecentConversationId } from "../utils/memoryUtils.js";
import { runInOrder } from "../utils/taskQueue.js";
import {
  checkWhatsAppCredentials,
  isValidSignature,
  markAsReadAndTyping,
  sendWhatsAppText,
  toWhatsAppText,
} from "../utils/whatsappUtils.js";

const SECRET_FIELDS = "+whatsappSettings.accessToken +whatsappSettings.appSecret";
// A WhatsApp chat has no "end", so a new conversation starts after a day of silence
const CONVERSATION_IDLE_MS = 1000 * 60 * 60 * 24;

interface WhatsAppMessage {
  id: string;
  from: string; // the customer's phone number
  type: string;
  text?: { body: string };
}

// Never send the encrypted secrets to the client, only whether they are saved
const toPublicSettings = (settings: IBotModel["whatsappSettings"]) => ({
  enabled: settings?.enabled ?? false,
  phoneNumberId: settings?.phoneNumberId ?? "",
  verifyToken: settings?.verifyToken ?? "",
  hasAccessToken: Boolean(settings?.accessToken),
  hasAppSecret: Boolean(settings?.appSecret),
});

// ---------- Dashboard settings ----------

export const getWhatsAppSettings = async (req: Request, res: Response) => {
  try {
    const { botId } = req.params;
    if (!botId || !mongoose.Types.ObjectId.isValid(botId)) {
      return res.status(400).json({ message: "Invalid Bot ID" });
    }
    const ownerId = (req.user as any)._id;
    const bot = await BotModel.findOne({ _id: botId, ownerId }).select(
      SECRET_FIELDS,
    );
    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    return res
      .status(200)
      .json({ whatsappSettings: toPublicSettings(bot.whatsappSettings) });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateWhatsAppSettings = async (
  req: Request<{}, {}, UpdateWhatsAppSettingsDto>,
  res: Response,
) => {
  const { botId, enabled, phoneNumberId, accessToken, appSecret } = req.body;
  const ownerId = (req.user as any)._id;
  try {
    const bot = await BotModel.findOne({ _id: botId, ownerId }).select(
      SECRET_FIELDS,
    );
    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    const current = bot.whatsappSettings;
    const newPhoneNumberId = phoneNumberId?.trim() ?? current?.phoneNumberId;
    // Secrets are only sent when they change
    const hasAccessToken = Boolean(accessToken || current?.accessToken);
    const hasAppSecret = Boolean(appSecret || current?.appSecret);

    if (enabled && !(newPhoneNumberId && hasAccessToken && hasAppSecret)) {
      return res.status(400).json({
        message:
          "Phone number ID, access token and app secret are required to enable WhatsApp",
      });
    }

    if (enabled) {
      const tokenToCheck = accessToken?.trim() || decrypt(current!.accessToken!);
      const metaError = await checkWhatsAppCredentials(newPhoneNumberId!, tokenToCheck);
      if (metaError) {
        return res.status(400).json({
          message: `Meta didn't accept the phone number ID and access token: ${metaError}`,
        });
      }
    }

    const updates: Record<string, any> = {
      "whatsappSettings.enabled": enabled,
      "whatsappSettings.phoneNumberId": newPhoneNumberId,
      "whatsappSettings.verifyToken": current?.verifyToken || generateKey(16),
    };
    if (accessToken) {
      updates["whatsappSettings.accessToken"] = encrypt(accessToken.trim());
    }
    if (appSecret) {
      updates["whatsappSettings.appSecret"] = encrypt(appSecret.trim());
    }

    const updatedBot = await BotModel.findOneAndUpdate(
      { _id: botId, ownerId },
      updates,
      { new: true },
    ).select(SECRET_FIELDS);

    return res.status(200).json({
      message: "WhatsApp settings updated successfully",
      whatsappSettings: toPublicSettings(updatedBot?.whatsappSettings),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ---------- Webhook called by Meta ----------

// Shows what happens with WhatsApp messages in the terminal
const log = (message: string) => console.log(`[WhatsApp] ${message}`);
const preview = (text: string) =>
  JSON.stringify(text.length > 200 ? `${text.slice(0, 200)}…` : text);

// Delivery updates for the bot's replies: sent, delivered, read or failed
const logStatus = (status: any) => {
  const error = status.errors?.[0];
  const details = error?.error_data?.details ? `, ${error.error_data.details}` : "";
  log(
    `Reply to +${status.recipient_id} is ${status.status}` +
      (error ? `: ${error.title} (code ${error.code})${details}` : ""),
  );
};

const findBotWithSecrets = async (botId: string | undefined) => {
  if (!botId || !mongoose.Types.ObjectId.isValid(botId)) return null;
  return BotModel.findById(botId).select(SECRET_FIELDS);
};

// Meta calls this once, when the webhook URL is saved in the Meta dashboard
export const verifyWebhook = async (req: Request, res: Response) => {
  try {
    const bot = await findBotWithSecrets(req.params.botId);
    const verifyToken = bot?.whatsappSettings?.verifyToken;

    if (
      verifyToken &&
      req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === verifyToken
    ) {
      log(`Meta verified the webhook URL for bot "${bot!.name}"`);
      return res.status(200).type("text/plain").send(req.query["hub.challenge"]);
    }
    log(
      bot
        ? `Webhook verification failed for bot "${bot.name}": the verify token doesn't match the one on its WhatsApp card`
        : `Webhook verification failed: no bot with ID "${req.params.botId}" (use the 24-character ID from the Callback URL on the card)`,
    );
    return res.sendStatus(403);
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Meta can deliver the same message more than once
const handledMessageIds = new Set<string>();
const isDuplicate = (messageId: string) => {
  if (handledMessageIds.has(messageId)) return true;
  handledMessageIds.add(messageId);
  if (handledMessageIds.size > 1000) {
    handledMessageIds.delete(handledMessageIds.values().next().value!);
  }
  return false;
};

export const receiveWebhook = async (req: Request, res: Response) => {
  try {
    const bot = await findBotWithSecrets(req.params.botId);
    const settings = bot?.whatsappSettings;
    if (
      !bot ||
      !settings?.enabled ||
      !settings.phoneNumberId ||
      !settings.accessToken ||
      !settings.appSecret
    ) {
      log(
        bot
          ? `Webhook received for bot "${bot.name}", but WhatsApp is switched off for it (or its settings are incomplete)`
          : `Webhook received for unknown bot ID "${req.params.botId}"`,
      );
      return res.sendStatus(404);
    }

    if (
      !isValidSignature(
        req.rawBody,
        req.get("x-hub-signature-256"),
        decrypt(settings.appSecret),
      )
    ) {
      log(
        `Rejected a webhook for bot "${bot.name}" with an invalid signature: check the App secret on its WhatsApp card`,
      );
      return res.sendStatus(401);
    }

    // Answer Meta right away, otherwise it sends the webhook again
    res.sendStatus(200);

    const phoneNumberId = settings.phoneNumberId;
    const accessToken = decrypt(settings.accessToken);
    const changes = (req.body.entry ?? []).flatMap(
      (entry: any) => entry.changes ?? [],
    );

    for (const { value = {} } of changes) {
      // The Meta app can have several numbers, only handle this bot's number
      if (value.metadata?.phone_number_id !== phoneNumberId) {
        log(
          `Ignored a webhook for phone number ID ${value.metadata?.phone_number_id}, bot "${bot.name}" uses ${phoneNumberId}`,
        );
        continue;
      }

      for (const status of value.statuses ?? []) logStatus(status);

      for (const message of (value.messages ?? []) as WhatsAppMessage[]) {
        if (isDuplicate(message.id)) continue;
        // Messages from the same customer are answered one at a time, in order
        runInOrder(
          `whatsapp:${bot._id}:${message.from}`,
          () => handleIncomingMessage(bot, phoneNumberId, accessToken, message),
          "[WhatsApp] Error handling message",
        );
      }
    }
  } catch (error: any) {
    console.error("[WhatsApp] Error in webhook:", error?.message);
    if (!res.headersSent) res.sendStatus(500);
  }
};

const handleIncomingMessage = async (
  bot: IBotModel,
  phoneNumberId: string,
  accessToken: string,
  message: WhatsAppMessage,
) => {
  log(
    `Message from +${message.from} to bot "${bot.name}": ` +
      (message.text?.body ? preview(message.text.body) : `(${message.type})`),
  );

  // Reactions (like 👍 on a message) don't need an answer
  if (message.type === "reaction") return;

  await markAsReadAndTyping(phoneNumberId, accessToken, message.id).catch(
    (error) =>
      console.error("[WhatsApp] Error marking message as read:", error?.message),
  );

  if (message.type !== "text" || !message.text?.body) {
    await sendWhatsAppText(
      phoneNumberId,
      accessToken,
      message.from,
      "Sorry, I can only read text messages for now.",
    );
    log(`Reply to +${message.from}: told them only text messages are supported`);
    return;
  }

  try {
    // The phone number identifies the customer, so the bot remembers them across conversations
    const visitorId = `whatsapp:${message.from}`;
    const conversationId = await findRecentConversationId(
      bot._id,
      visitorId,
      CONVERSATION_IDLE_MS,
    );
    const { answer } = await generateReply({
      bot,
      message: message.text.body,
      conversationId,
      visitorId,
      channel: "whatsapp",
    });

    await sendWhatsAppText(
      phoneNumberId,
      accessToken,
      message.from,
      toWhatsAppText(answer),
    );
    log(`Reply to +${message.from}: ${preview(answer)}`);
  } catch (error: any) {
    console.error("[WhatsApp] Error answering message:", error?.message);
    await sendWhatsAppText(
      phoneNumberId,
      accessToken,
      message.from,
      "Sorry, something went wrong. Please try again in a moment.",
    );
  }
};
