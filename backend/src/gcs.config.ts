// Path to your downloaded service account key file

import { Storage } from "@google-cloud/storage";
import vision from "@google-cloud/vision";

// Initialize the GCS client
export const storage = new Storage({
  keyFilename: process.env.GCP_KEY_FILE!,
  projectId: process.env.GCP_PROJECT_ID!,
});

export const bucketName = process.env.GCP_BUCKET_NAME!;

export const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GCP_KEY_FILE!,
});
