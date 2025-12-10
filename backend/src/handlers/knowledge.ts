import type { Request, Response } from "express";
import KnowledgeModel from "../database/schemas/knowledge.js";
import { uploadToGCS } from "../utils/gcsUploader.js";

export const save = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id.toString();
    const ownerId: string = (req.user as any)._id;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided." });
    }
    const gcsFolder: string = "bots_data";
    const fileUrl: string = await uploadToGCS(file, gcsFolder, botId);
    const knowledge = await KnowledgeModel.create({
      botId,
      ownerId,
      fileUrl,
      title: file.originalname,
      originalFileName: file.originalname,
      fileType: file.mimetype,
    });

    return res.status(200).json({
      message: "Knowledge saved successfully.",
      knowledge: knowledge,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
