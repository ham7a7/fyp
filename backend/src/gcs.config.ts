// Path to your downloaded service account key file

import { Storage } from "@google-cloud/storage";

const keyFilePath = "./aichatbotbuilder-fyp-9582f5c9082c.json";

// Initialize the GCS client
export const storage = new Storage({
  keyFilename: keyFilePath,
  projectId: process.env.GCP_PROJECT_ID!,
});

export const bucketName = process.env.GCP_BUCKET_NAME!;
