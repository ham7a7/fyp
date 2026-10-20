// import {pdf} from "pdf-parse";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { createChatModel } from "../ai.config.js";

// Image formats accepted by OpenAI vision models
const SUPPORTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

// Arabic letters in their joined display shapes (Unicode "presentation forms")
const ARABIC_PRESENTATION_FORMS = /[ﭐ-﷿ﹰ-﻿]/;
const MIRRORED_BRACKETS: Record<string, string> = {
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
};
// Numbers and Latin words (e.g. phone numbers, prices, "Pepsi Cola")
const LEFT_TO_RIGHT_RUN = /[A-Za-z0-9](?:[A-Za-z0-9@._/+\- ]*[A-Za-z0-9])?/g;
// Plain (not joined) Arabic letters at the start or end of a word. The PDF reader already
// returns these in reading order, so they must not be reversed with the rest of the line
const PLAIN_ARABIC = "\\u0621-\\u064A\\u0671-\\u06D3";
const WORD_EDGE_PLAIN_ARABIC = new RegExp(
  `(?<=^[^\\p{L}]*)[${PLAIN_ARABIC}]{2,}|[${PLAIN_ARABIC}]{2,}(?=[^\\p{L}]*$)`,
  "gu",
);
const reverseString = (text: string) => Array.from(text).reverse().join("");

// PDFs often store Arabic the way it's displayed: letters as joined shapes, and each
// line reversed (right-to-left visual order). This turns such a line back into normal
// Arabic text in reading order, so it can be searched.
const fixVisualArabicLine = (line: string) => {
  if (!ARABIC_PRESENTATION_FORMS.test(line)) return line;

  const reversed = Array.from(
    // Pre-reverse the word-edge letters, so the line reversal puts them back in reading order
    line.replace(/\S+/g, (word) =>
      word.replace(WORD_EDGE_PLAIN_ARABIC, reverseString),
    ),
  )
    .reverse()
    .map((char) => MIRRORED_BRACKETS[char] ?? char)
    .join("");

  return (
    reversed
      // Numbers and Latin words were reversed too, so turn them back
      .replace(LEFT_TO_RIGHT_RUN, reverseString)
      // Turn the display shapes into normal Arabic letters
      .normalize("NFKC")
  );
};

export const fixVisualArabicText = (text: string) =>
  text.split("\n").map(fixVisualArabicLine).join("\n");

// Reads the text in an image (OCR), or describes the image if it has no text
const imageToText = async (
  bufferFile: Buffer,
  mimeType: string,
): Promise<string> => {
  // Always GPT-4o here: the chat model may be changed to one without image support
  const llm = createChatModel("gpt-4o");
  const response = await llm.invoke([
    {
      role: "user",
      content: [
        {
          type: "text",
          text: 'Extract all of the text in this image exactly as written, without any commentary. If the image contains no text, reply with a short description starting with "This is an image containing:".',
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${bufferFile.toString("base64")}`,
          },
        },
      ],
    },
  ]);

  return response.content.toString();
};

export const bufferToText = async (
  bufferFile: Buffer,
  mimeType: string,
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
      textContent = fixVisualArabicText(
        content.pages.map((page) => page.text).join("\n"),
      );
    } else if (mimeType.startsWith("image/")) {
      // Image (OCR with GPT-4o vision)
      textContent = SUPPORTED_IMAGE_TYPES.includes(mimeType)
        ? await imageToText(bufferFile, mimeType)
        : "Unsupported";
    } else if (
      mimeType.includes(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
      // when the file type is not supported
      textContent = "Unsupported";
    }
  } catch (error) {
    throw new Error(`Failed to extract text from file. ${error}`);
  }
  return textContent;
};
