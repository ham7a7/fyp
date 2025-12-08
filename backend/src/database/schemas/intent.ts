import mongoose, { Schema } from "mongoose";
import type { IIntentModel } from "../../types/intentModel.js";

export const IntentSchema: Schema<IIntentModel> = new Schema(
  {
    name: { type: String, required: true },
    botId: { type: mongoose.Types.ObjectId, required: true, ref: "Bot" },
    ownerId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    trainingPhrases: [{ type: String, required: true }],
    responses: [{ type: String, required: true }],
    isFulfillment: { type: Boolean, required: true },
    webhookUrl: { type: String },
    webhookHeaders: [{ type: Map, of: String }],
  },
  { timestamps: true }
);

const IntentModel = mongoose.model<IIntentModel>("Intent", IntentSchema);
export default IntentModel;
