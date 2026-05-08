import type mongoose from "mongoose";

export interface webhookHeaders {
  key: string;
  value: string;
}
export interface IIntentModel {
  _id: mongoose.Types.ObjectId;
  botId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  trainingPhrases: string[];
  responses: string[];
  isFulfillment: boolean;
  webhookUrl: string;
  webhookHeaders: webhookHeaders[];
  createdAt: Date;
  updatedAt: Date;
}
