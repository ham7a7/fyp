import type mongoose from "mongoose";

export interface IBotModel {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  usecase: string;
  language: string;
  status: string;
  origins?: string[];
  widgetSettings?: {
    headerName: string;
    primaryColor: string;
    darkMode: boolean;
    welcomeTitle: string;
    welcomeMessage: string;
  };
  whatsappSettings?: {
    enabled: boolean;
    phoneNumberId?: string;
    accessToken?: string; // encrypted
    appSecret?: string; // encrypted
    verifyToken?: string;
  };
  // intents: mongoose.Types.ObjectId[];
  // knowledgeBase: mongoose.Types.ObjectId[];
  //   widgetSettings: mongoose.Types.ObjectId;
  //   analytics: mongoose.Types.ObjectId;
  publicBotId: String; // used in widget.js example: data-bot-id="123xyz"
  apiKey: String; // x-api-key for mobile and backend integrations
  createdAt: Date;
  updatedAt: Date;
}
