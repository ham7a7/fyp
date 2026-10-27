import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";
config();

// Uses OpenAI directly. Set AI_PROVIDER=openrouter in .env to go through OpenRouter instead
const useOpenRouter = process.env.AI_PROVIDER === "openrouter";

const apiKey = useOpenRouter
  ? process.env.OPENROUTER_API_KEY!
  : process.env.OPENAI_API_KEY!;
// OpenRouter is OpenAI-compatible, so the same LangChain classes are pointed at its API
const configuration = useOpenRouter
  ? { baseURL: "https://openrouter.ai/api/v1" }
  : {};

// OpenRouter names OpenAI's models "openai/<model>"
const modelName = (model: string) =>
  useOpenRouter && !model.includes("/") ? `openai/${model}` : model;

export const createChatModel = (
  model: string = process.env.AI_CHAT_MODEL || "gpt-4o",
  // Caps the answer length. OpenRouter reserves credit for the maximum, so a lower cap
  // keeps calls working on a small balance
  maxTokens?: number
) =>
  new ChatOpenAI({
    model: modelName(model),
    apiKey,
    configuration,
    ...(maxTokens && { maxTokens }),
  });

// Cheaper model for helper tasks like rewriting questions and updating memory
export const createFastChatModel = () => createChatModel("gpt-4o-mini");

// Don't change this model: the vectors already stored in MongoDB were created with it,
// and the Atlas vector index expects its 1536 dimensions
export const createEmbeddings = () =>
  new OpenAIEmbeddings({
    model: modelName("text-embedding-3-small"),
    apiKey,
    configuration,
  });
