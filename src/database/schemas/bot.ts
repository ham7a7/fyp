import mongoose, { Schema } from "mongoose";
import type { IBotModel } from "../../types/botModel.js";

export const BotSchema: Schema<IBotModel> = new Schema(
  {
    name: { type: String, required: true },
    onwerId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    description: {
      type: String,
      required: true,
    },
    usecase: {
      type: String,
      enum: ["Website", "Mobile App", "Other"],
      required: true,
    },
    language: { type: String, required: true },

    status: {
      type: String,
      enum: ["Active", "Disabled"],
      default: "Active",
      required: true,
    },
    // intents: [{ type: mongoose.Types.ObjectId, ref: "Intent" }],
    // knowledgeBase: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "KnowledgeBase",
    //   required: true,
    // },
    // widgetSettings: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "WidgetSetting",
    //   required: true,
    // },
    // analytics: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Analytic",
    //   required: true,
    // },
    publicBotId: { type: String, required: true, unique: true },
    origins: [{ type: String }],
    apiKey: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const BotModel = mongoose.model<IBotModel>("Bot", BotSchema);
export default BotModel;
