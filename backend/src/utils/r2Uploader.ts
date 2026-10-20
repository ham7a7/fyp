import { PutObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, r2Client } from "../r2.config.js";

// Function to upload the buffer to R2, returns the object key of the uploaded file
export const uploadToR2 = async (
  file: Express.Multer.File,
  r2Folder: string,
  botId: string
): Promise<string> => {
  // We use the bot ID and a unique timestamp to organize uploads by bot
  const fileKey = [
    r2Folder,
    botId,
    `${Date.now()}-${file.originalname.replace(/ /g, "_")}`,
  ]
    .filter(Boolean)
    .join("/");

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          uploader: "Express-App",
          botId: botId,
        },
      })
    );
  } catch (err) {
    console.log("Error uploading to R2:", err);
    throw err;
  }

  return fileKey;
};
