import type mongoose from "mongoose";

export interface IVisitorMemoryModel {
  _id: mongoose.Types.ObjectId;
  botId: mongoose.Types.ObjectId;
  visitorId: string;
  memories: string[];
  createdAt: Date;
  updatedAt: Date;
}
