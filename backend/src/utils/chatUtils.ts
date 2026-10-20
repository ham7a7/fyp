import axios from "axios";
import IntentModel from "../database/schemas/intent.js";
import type { IBotModel } from "../types/botModel.js";
import type { IIntentModel } from "../types/intentModel.js";
import {
  getLongTermMemory,
  getOrCreateConversation,
  saveExchange,
  updateLongTermMemory,
} from "./memoryUtils.js";
import { askQuestion, type Channel } from "./ragUtils.js";
import { runInOrder } from "./taskQueue.js";

interface GenerateReplyOptions {
  bot: IBotModel;
  message: string;
  conversationId?: string | undefined;
  visitorId?: string | undefined;
  channel?: Channel;
}

// Shared by every channel (website widget, API, WhatsApp): answers a message using the
// bot's intents, knowledge and memory, then saves the exchange to the conversation
export const generateReply = async ({
  bot,
  message,
  conversationId,
  visitorId,
  channel = "widget",
}: GenerateReplyOptions) => {
  const intents: IIntentModel[] | null = await IntentModel.find({
    botId: bot._id,
    ownerId: bot.ownerId,
  }).select({
    name: 1,
    _id: 1,
    trainingPhrases: 1,
    responses: 1,
    isFulfillment: 1,
    webhookUrl: 1,
    webhookHeaders: 1,
  });

  // Short-term memory: recent messages of this conversation
  // Long-term memory: what the bot remembers about this visitor from earlier conversations
  const [conversation, memories] = await Promise.all([
    getOrCreateConversation(bot._id, conversationId, visitorId),
    getLongTermMemory(bot._id, visitorId),
  ]);

  let answer = await askQuestion(
    message,
    bot,
    intents,
    conversation.messages,
    memories,
    channel,
  );
  console.log("Answer:", answer);
  answer = await handleWebhook(message, answer);
  console.log("Answer:", answer);

  await saveExchange(conversation._id, message, answer);
  if (visitorId) {
    // Runs in the background so the visitor doesn't wait for it
    runInOrder(
      `memory:${bot._id}:${visitorId}`,
      () => updateLongTermMemory(bot._id, visitorId, message, answer),
      "Error updating long-term memory",
    );
  }

  return { answer, conversationId: conversation._id };
};

const handleWebhook = async (message: string, AIAnswer: string) => {
  const answer = AIAnswer;
  if (
    answer &&
    typeof answer === "string" &&
    answer.includes("fulfillment") &&
    answer.includes("webhookUrl")
  ) {
    const fulfillmentData = JSON.parse(answer);
    if (
      fulfillmentData &&
      fulfillmentData.fulfillment &&
      fulfillmentData.webhookUrl
    ) {
      // Call the webhook with the necessary data
      const intent = await IntentModel.findById(fulfillmentData._id);
      if (intent) {
        const res = await axios.post(
          fulfillmentData.webhookUrl,
          {
            query: message,
            intentId: fulfillmentData._id,
            webhookHeaders: fulfillmentData.webhookHeaders,
          },
          {
            headers: fulfillmentData.webhookHeaders,
          },
        );
        if (!res.data || !res.data.response) {
          throw new Error(
            "Invalid response from webhook, missing 'response' field",
          );
        }
        return res.data.response;
      }
    }
  }
  return answer;
};
