// import {pdf} from "pdf-parse";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

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
    } else if (
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
    throw new Error(`Failed to extract text from file.`);
  }
  return textContent;
};
