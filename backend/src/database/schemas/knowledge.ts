import mongoose, { Schema } from "mongoose";
import type { IKnowledgeModel } from "../../types/knowledgeModel.js";

export const KnowledgeSchema: Schema<IKnowledgeModel> = new Schema(
  {
    botId: { type: mongoose.Types.ObjectId, required: true, ref: "Bot" },
    ownerId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    description: { type: String },
    fileKey: { type: String, required: true }, // object key in the R2 bucket
    fileUrl: { type: String }, // legacy: GCS URL of files uploaded before the R2 migration
    originalFileName: { type: String, required: true },
    fileType: { type: String, required: true },
  },
  { timestamps: true }
);

const KnowledgeModel = mongoose.model<IKnowledgeModel>(
  "Knowledge",
  KnowledgeSchema
);
export default KnowledgeModel;
