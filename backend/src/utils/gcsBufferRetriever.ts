import { bucketName, storage } from "../gcs.config.js";

/**
 * Downloads a file buffer to be processed by the AI embedding model.
 */
export const getFileBuffer = async (gcsPath: string): Promise<Buffer> => {
  const [content] = await storage.bucket(bucketName).file(gcsPath).download();

  return content;
};
