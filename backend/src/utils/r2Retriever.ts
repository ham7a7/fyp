import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { bucketName, r2Client } from "../r2.config.js";

/**
 * Downloads a file buffer to be processed by the AI embedding model.
 */
export const getFileBuffer = async (fileKey: string): Promise<Buffer> => {
  const { Body } = await r2Client.send(
    new GetObjectCommand({ Bucket: bucketName, Key: fileKey })
  );
  if (!Body) throw new Error(`File ${fileKey} has no content.`);

  return Buffer.from(await Body.transformToByteArray());
};

/**
 * R2 buckets are private, so files are viewed through short-lived signed URLs.
 */
export const getSignedFileUrl = async (
  fileKey: string,
  expiresIn: number = 60 * 60 // URL expires in 1 hour
): Promise<string> =>
  getSignedUrl(
    r2Client,
    new GetObjectCommand({ Bucket: bucketName, Key: fileKey }),
    { expiresIn }
  );

export const deleteFromR2 = async (fileKey: string): Promise<void> => {
  // R2 returns success even if the file was already deleted
  await r2Client.send(
    new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey })
  );
  console.log(`Successfully deleted ${fileKey} from R2.`);
};
