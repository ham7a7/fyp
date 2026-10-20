import type mongoose from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IConversationModel {
  _id: mongoose.Types.ObjectId;
  botId: mongoose.Types.ObjectId;
  visitorId?: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
