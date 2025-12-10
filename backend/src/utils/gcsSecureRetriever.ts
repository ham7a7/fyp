// src/utils/gcsRetriever.ts

import { bucketName, storage } from "../gcs.config.js";

/**
 * Generates a temporary URL for a client to download a specific document.
 * @param fileName The path in GCS (e.g., "botId/timestamp-file.pdf")
 * @returns A temporary URL valid for a specific duration.
 */
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
