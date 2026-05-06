import mongoose, { Schema } from "mongoose";
import type { IKnowledgeVector } from "../../types/knowledgeVectorModel.js";

const KnowledgeVectorSchema: Schema<IKnowledgeVector> = new Schema({
  knowledgeId: {
    type: Schema.Types.ObjectId,
    ref: "Knowledge",
    required: true,
  },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  metadata: { type: Map, of: String },
});

const KnowledgeVectorModel = mongoose.model<IKnowledgeVector>(
  "KnowledgeVector",
  KnowledgeVectorSchema
);

export default KnowledgeVectorModel;
