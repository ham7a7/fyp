import type { Request, Response } from "express";
import KnowledgeModel from "../database/schemas/knowledge.js";
import { bufferToText } from "../utils/extractText.js";
import { uploadToGCS } from "../utils/gcsUploader.js";
import { addDocumentToVectorDB } from "./../utils/ragUtils.js";

export const save = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id.toString();
    const ownerId: string = (req.user as any)._id;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided." });
    }
    const gcsFolder: string = "bots_data";
    // Upload File to GCS
    const fileUrl: string = await uploadToGCS(file, gcsFolder, botId);
    // Get file buffer
    const bufferFile: Buffer = file.buffer;
    // Convert buffer to text
    const text = await bufferToText(bufferFile, file.mimetype);

    const knowledge = await KnowledgeModel.create({
      botId,
      ownerId,
      fileUrl,
      title: file.originalname,
      originalFileName: file.originalname,
      fileType: file.mimetype,
    });

    // Fields of the VDB
    const metadata: Record<string, any> = {
      knowledgeId: knowledge._id,
    };
    // Create embeddings and save to Vector DB
    await addDocumentToVectorDB(text, metadata);
    return res.status(200).json({
      message: "Knowledge saved successfully.",
      knowledge: knowledge,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error });
  }
};
