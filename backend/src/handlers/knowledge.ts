import type { Request, Response } from "express";
import mongoose from "mongoose";
import KnowledgeModel from "../database/schemas/knowledge.js";
import KnowledgeVectorModel from "../database/schemas/knowledgeVector.js";
import { bucketName } from "../gcs.config.js";
import { bufferToText } from "../utils/extractText.js";
import { deleteFromGCS } from "../utils/gcsRetriever.js";
import { uploadToGCS } from "../utils/gcsUploader.js";
import { addDocumentToVectorDB } from "./../utils/ragUtils.js";

export const save = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id;
    const ownerId: string = (req.user as any)._id;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided." });
    }
        // Get file buffer
    const bufferFile: Buffer = file.buffer;
    // Convert buffer to text
    const text = await bufferToText(bufferFile, file.mimetype);
    console.log(text);
    if (text.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Extracted text content is empty or invalid." });
    }

    const gcsFolder: string = process.env.GCS_FOLDER_NAME!;
    // Upload File to GCS
    const fileUrl: string = await uploadToGCS(
      file,
      gcsFolder,
      botId.toString()
    );

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
      botId: botId.toString(),
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

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id;
    const ownerId = (req.user as any)._id;

    const documents = await KnowledgeModel.find({ botId, ownerId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ knowledge: documents });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error });
  }
}

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id;
    const ownerId = (req.user as any)._id;
    const knowledgeId = req.params.knowledgeId;
    if(!knowledgeId || !mongoose.Types.ObjectId.isValid(knowledgeId)){
      return res.status(400).json({ message: "Invalid knowledge ID" });
    }
    const document = await KnowledgeModel.findOneAndDelete({
      _id: knowledgeId,
      botId,
      ownerId,
    });
    if (!document) {
      return res.status(404).json({ message: "Knowledge document not found." });
    }

    await KnowledgeVectorModel.deleteMany({
      knowledgeId: knowledgeId,
      botId: botId.toString(),
    });

const baseUrl = `https://storage.googleapis.com/${bucketName}/`;
const filePath = document.fileUrl.replace(baseUrl, '');
    await deleteFromGCS(filePath);

    return res
      .status(200)
      .json({ message: "Knowledge document deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error });
  }
}

