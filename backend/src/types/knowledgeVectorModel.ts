import type mongoose from "mongoose";

export interface IKnowledgeVector {
  knowledgeId: mongoose.Types.ObjectId; // Reference to the parent knowledge document
  text: string; // The actual text content of the chunk
  embedding: number[]; // The vector embedding (array of numbers)
  metadata: Record<string, string>;
  createdAt: Date;
  updatedAt: Date; // Optional metadata (page number, source, etc.)
}
