import mongoose, { Schema } from "mongoose";
import type { IVisitorMemoryModel } from "../../types/visitorMemoryModel.js";

// Long-term memory: facts a bot remembers about a visitor across conversations
export const VisitorMemorySchema: Schema<IVisitorMemoryModel> = new Schema(
  {
    botId: { type: mongoose.Types.ObjectId, required: true, ref: "Bot" },
    visitorId: { type: String, required: true },
    memories: [{ type: String }],
  },
  { timestamps: true }
);

VisitorMemorySchema.index({ botId: 1, visitorId: 1 }, { unique: true });

const VisitorMemoryModel = mongoose.model<IVisitorMemoryModel>(
  "VisitorMemory",
  VisitorMemorySchema
);
export default VisitorMemoryModel;
