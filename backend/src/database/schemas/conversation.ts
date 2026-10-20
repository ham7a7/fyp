import mongoose, { Schema } from "mongoose";
import type {
  IChatMessage,
  IConversationModel,
} from "../../types/conversationModel.js";

const ChatMessageSchema: Schema<IChatMessage> = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Short-term memory: the messages of one chat session
export const ConversationSchema: Schema<IConversationModel> = new Schema(
  {
    botId: { type: mongoose.Types.ObjectId, required: true, ref: "Bot" },
    visitorId: { type: String },
    messages: [ChatMessageSchema],
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model<IConversationModel>(
  "Conversation",
  ConversationSchema
);
export default ConversationModel;
