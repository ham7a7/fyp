import crypto from "crypto";
import { config } from "dotenv";
config();

// Use a 32-byte key for AES-256 (derived from your .env variable)
const ENCRYPTION_KEY = Buffer.from(process.env.API_ENCRYPTION_KEY!, "hex");
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // AES standard

/**
 * Encrypts a plaintext API key.
 * The result is a combined string: Initialization Vector (IV) + Ciphertext.
 * This is crucial for security.
 */
export const encrypt = (text: string): string => {
  if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("Encryption key length is invalid. Must be 32 bytes.");
  }

  // Generate a unique IV for every encryption (critical for security)
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Combine IV and Ciphertext for storage, separated by a colon
  return iv.toString("hex") + ":" + encrypted;
};

/**
 * Decrypts the stored key string back to its original plaintext API key.
 */
export const decrypt = (text: string): string => {
  if (!text || text.indexOf(":") === -1) {
    throw new Error("Invalid encrypted key format.");
  }

  const parts = text.split(":");
  const iv = Buffer.from(parts.shift() as string, "hex"); // Extract the IV
  const encryptedText = parts.join(":"); // The rest is the ciphertext

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

export const generateKey = (length: number): string => {
  return crypto.randomBytes(length).toString("hex");
};
