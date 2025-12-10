import { bucketName, storage } from "../gcs.config.js";

/**
 * Downloads a file buffer to be processed by the AI embedding model.
 */
export const getFileBuffer = async (gcsPath: string): Promise<Buffer> => {
  const [content] = await storage.bucket(bucketName).file(gcsPath).download();

  return content;
};

export const getSignedUrl = async (gcsPath: string): Promise<string> => {
  const options = {
    version: "v4" as "v4",
    action: "read" as "read",
    expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
  };

  const [url] = await storage
    .bucket(bucketName)
    .file(gcsPath)
    .getSignedUrl(options);

  return url;
};
