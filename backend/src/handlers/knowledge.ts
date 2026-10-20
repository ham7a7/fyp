import type { Request, Response } from "express";
import mongoose from "mongoose";
import KnowledgeModel from "../database/schemas/knowledge.js";
import KnowledgeVectorModel from "../database/schemas/knowledgeVector.js";
import type { IKnowledgeModel } from "../types/knowledgeModel.js";
import { bufferToText } from "../utils/extractText.js";
import { deleteFromR2, getSignedFileUrl } from "../utils/r2Retriever.js";
import { uploadToR2 } from "../utils/r2Uploader.js";
import { addDocumentToVectorDB } from "./../utils/ragUtils.js";

// R2 files are private, so the client gets a signed URL to view them.
// Files uploaded before the R2 migration have no fileKey and keep their old fileUrl.
const withFileUrl = async (
  document: Pick<IKnowledgeModel, "fileKey" | "fileUrl">,
) => ({
  ...document,
  fileUrl: document.fileKey
    ? await getSignedFileUrl(document.fileKey)
    : document.fileUrl,
});

export const save = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id;
    const ownerId: string = (req.user as any)._id;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided." });
    }
    // The upload library reads file names as Latin-1, which garbles names like Arabic ones
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
    // Get file buffer
    const bufferFile: Buffer = file.buffer;
    console.log("File buffer received, size:", bufferFile.length);
    // Convert buffer to text
    const text = await bufferToText(bufferFile, file.mimetype);

    if (text.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Extracted text content is empty or invalid." });
    }
    if (text === "Unsupported") {
      return res
        .status(400)
        .json({ message: "Unsupported file type. Unable to extract text." });
    }
    console.log("Extracted Text Content:", text);
    const r2Folder: string = process.env.R2_FOLDER_NAME!;
    // Upload File to R2
    const fileKey: string = await uploadToR2(
      file,
      r2Folder,
      botId.toString(),
    );

    const knowledge = await KnowledgeModel.create({
      botId,
      ownerId,
      fileKey,
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
    try {
      await addDocumentToVectorDB(text, metadata);
    } catch (error: any) {
      // Undo the upload, so there's no document the bot can't search
      console.error("Error making the document searchable:", error?.message);
      await KnowledgeVectorModel.deleteMany({ knowledgeId: knowledge._id });
      await KnowledgeModel.deleteOne({ _id: knowledge._id });
      await deleteFromR2(fileKey);
      return res.status(500).json({
        message: `The document couldn't be processed, so it wasn't saved. Please try again. (${error?.message})`,
      });
    }
    return res.status(200).json({
      message: "Knowledge saved successfully.",
      knowledge: await withFileUrl(knowledge.toObject()),
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id;
    const ownerId = (req.user as any)._id;

    const documents = await KnowledgeModel.find({ botId, ownerId })
      .sort({
        createdAt: -1,
      })
      .lean();

    return res
      .status(200)
      .json({ knowledge: await Promise.all(documents.map(withFileUrl)) });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id;
    const ownerId = (req.user as any)._id;
    const knowledgeId = req.params.knowledgeId;
    if (!knowledgeId || !mongoose.Types.ObjectId.isValid(knowledgeId)) {
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

    // Files uploaded before the R2 migration were stored in GCS, not R2
    if (document.fileKey) {
      await deleteFromR2(document.fileKey);
    }

    return res
      .status(200)
      .json({ message: "Knowledge document deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error });
  }
};
