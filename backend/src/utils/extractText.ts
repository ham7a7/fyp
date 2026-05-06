// import {pdf} from "pdf-parse";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { visionClient } from "../gcs.config.js";

export const bufferToText = async (
  bufferFile: Buffer,
  mimeType: string
): Promise<string> => {
  let textContent = "";
  try {
    if (mimeType.includes("text/plain")) {
      // 1. TXT (Plain Text)
      textContent = bufferFile.toString("utf8");
    } else if (mimeType.includes("application/pdf")) {
      // 2. PDF
      const data = new PDFParse({ data: bufferFile });
      const content = await data.getText();
      textContent = content.pages.map((page) => page.text).join("\n");
    } else if (mimeType.startsWith("image/")) {
        // --- NEW: Image Processing Logic ---
        const [result] = await visionClient.textDetection(bufferFile);
        const annotations = result.textAnnotations;
        
        if (annotations && annotations.length > 0) {
            // annotations[0] contains the full text block
            textContent = annotations[0]!.description || "";
        } else {
            // Optional: If no text is found, use Image Properties to describe it
            const [labelResult] = await visionClient.labelDetection(bufferFile);
            const labels = labelResult.labelAnnotations?.map(l => l.description).join(", ");
            textContent = `This is an image containing: ${labels}`;
        }
    }
    
    else if (
      mimeType.includes(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ) {
      // 3. DOCX
      const result = await mammoth.extractRawText({ buffer: bufferFile });
      textContent = result.value;
    } else if (
      mimeType.includes("text/csv") ||
      mimeType.includes("application/json")
    ) {
      // 4. CSV/JSON
      textContent = bufferFile.toString("utf8");
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    throw new Error(`Failed to extract text from file. ${error}`);
  }
  return textContent;
};
