import type { Request, Response } from "express";
import { uploadToGCS } from "../utils/gcsUploader.js";

export const save = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id.toString();
    const userId: string = (req.user as any)._id;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided." });
    }
    const fileUrl = await uploadToGCS(file, userId, botId);

    // TODO: In your project, save this URL/path to your MongoDB UploadedData collection [cite: 69]
    // await UploadedDataModel.create({ botId, path: fileUrl, originalName: file.originalname });

    return res.status(200).json({
      message: "File uploaded successfully.",
      url: fileUrl,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
