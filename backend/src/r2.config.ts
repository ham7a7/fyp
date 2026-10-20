import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

// Cloudflare R2 is S3-compatible, so we use the AWS S3 client pointed at the R2 endpoint
export const r2Client = new S3Client({
  region: "auto",
  endpoint:
    process.env.R2_ENDPOINT_URL ||
    `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // R2 doesn't support all of the checksum headers the SDK sends by default
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export const bucketName = process.env.R2_BUCKET_NAME!;
