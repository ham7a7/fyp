import { bucketName, storage } from "../gcs.config.js";

// Function to upload the buffer to GCS
export const uploadToGCS = async (
  file: Express.Multer.File,
  gcsFolder: string,
  botId: string
): Promise<string> => {
  // 1. Define the GCS file path structure
  // We use the bot ID and a unique timestamp to organize uploads by user/bot
  const fileName = `${gcsFolder}/${botId}/${Date.now()}-${file.originalname.replace(
    / /g,
    "_"
  )}`;
  const fileBucket = storage.bucket(bucketName);
  const blob = fileBucket.file(fileName);

  // 2. Create the GCS file stream writer
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
      // You can add custom metadata if needed
      metadata: {
        uploader: "Express-App",
        botId: botId,
      },
    },
  });

  return new Promise<string>((resolve, reject) => {
    blobStream.on("error", (err) => {
      console.log("Error uploading to GCS:", err);
      reject(err);
    });

    blobStream.on("finish", () => {
      // The file is now publically accessible via this URL structure (if public)
      // Or you can return a non-public URL and manage access via signed URLs
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      resolve(publicUrl);
    });

    // 3. Pipe the Multer buffer directly to GCS
    blobStream.end(file.buffer);
  });
};
