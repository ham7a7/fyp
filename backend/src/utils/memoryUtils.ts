import mongoose from "mongoose";
import ConversationModel from "../database/schemas/conversation.js";
import VisitorMemoryModel from "../database/schemas/visitorMemory.js";
import { createFastChatModel } from "../ai.config.js";

// Number of recent messages the bot sees from the current conversation
export const SHORT_TERM_LIMIT = 10;
// Number of facts the bot keeps about a visitor
const LONG_TERM_LIMIT = 20;

// ---------- Short-term memory: the current conversation ----------

export const getOrCreateConversation = async (
  botId: mongoose.Types.ObjectId,
  conversationId?: string,
  visitorId?: string,
) => {
  if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
    // Only the visitor who started a conversation can continue it
    const conversation = await ConversationModel.findOne(
      { _id: conversationId, botId, visitorId: visitorId || null },
      { messages: { $slice: -SHORT_TERM_LIMIT } },
    );
    if (conversation) return conversation;
  }

  return ConversationModel.create({
    botId,
    messages: [],
    ...(visitorId && { visitorId }),
  });
};

// For channels without a browser session (like WhatsApp): continue the visitor's latest
// conversation, unless it has been inactive for too long
export const findRecentConversationId = async (
  botId: mongoose.Types.ObjectId,
  visitorId: string,
  maxIdleMs: number,
) => {
  const conversation = await ConversationModel.findOne({
    botId,
    visitorId,
    updatedAt: { $gte: new Date(Date.now() - maxIdleMs) },
  })
    .sort({ updatedAt: -1 })
    .select({ _id: 1 })
    .lean();

  return conversation?._id.toString();
};

export const saveExchange = async (
  conversationId: mongoose.Types.ObjectId,
  userMessage: string,
  botAnswer: string,
) =>
  ConversationModel.updateOne(
    { _id: conversationId },
    {
      $push: {
        messages: {
          $each: [
            { role: "user", content: userMessage },
            { role: "assistant", content: botAnswer },
          ],
        },
      },
    },
  );

// ---------- Long-term memory: facts about the visitor ----------

export const getLongTermMemory = async (
  botId: mongoose.Types.ObjectId,
  visitorId?: string,
): Promise<string[]> => {
  if (!visitorId) return [];
  const memory = await VisitorMemoryModel.findOne({ botId, visitorId }).lean();
  return memory?.memories ?? [];
};

// Asks the LLM what is worth remembering from the latest exchange and saves the updated facts.
// Run it with runInOrder per visitor, so two updates can't overwrite each other.
export const updateLongTermMemory = async (
  botId: mongoose.Types.ObjectId,
  visitorId: string,
  userMessage: string,
  botAnswer: string,
) => {
  const memories = await getLongTermMemory(botId, visitorId);
  const llm = createFastChatModel();
  const response = await llm.invoke(
    [
      {
        role: "system",
        content: `You manage the long-term memory a chatbot keeps about one user.
Given what is already remembered and the latest exchange, return the updated memory as JSON: {"memories": ["...", "..."]}

RULES:
- Remember lasting facts that will help in future conversations: the user's name, preferences, contact details they chose to share, their situation, ongoing issues or orders.
- Don't remember greetings, one-off questions, general knowledge, or what the assistant said.
- Update facts that changed, remove facts the user corrected, and merge duplicates.
- Write each memory as a short sentence about the user, e.g. "Their name is Sara."
- Keep at most ${LONG_TERM_LIMIT} memories, dropping the least useful ones.
- If nothing new was learned, return the existing memories unchanged.`,
      },
      {
        role: "user",
        content: `Already remembered:
${JSON.stringify(memories)}

Latest exchange:
User: ${userMessage}
Assistant: ${botAnswer}`,
      },
    ],
    { response_format: { type: "json_object" } },
  );

  const parsed = JSON.parse(response.content.toString());
  if (!Array.isArray(parsed.memories)) return;

  const updatedMemories: string[] = parsed.memories
    .filter((memory: unknown) => typeof memory === "string" && memory.trim())
    .slice(0, LONG_TERM_LIMIT);

  if (JSON.stringify(updatedMemories) === JSON.stringify(memories)) return;

  await VisitorMemoryModel.updateOne(
    { botId, visitorId },
    { memories: updatedMemories },
    { upsert: true },
  );
};
