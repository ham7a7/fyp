import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { config } from "dotenv";
import { mongoose } from "../database/db.js";
import KnowledgeVectorModel from "../database/schemas/knowledgeVector.js";
import {
  createChatModel,
  createEmbeddings,
  createFastChatModel,
} from "../ai.config.js";
import type { IBotModel } from "../types/botModel.js";
import type { IChatMessage } from "../types/conversationModel.js";
import type { IIntentModel } from "../types/intentModel.js";
config();

const VECTOR_INDEX_NAME = "vector_index";

const getVectorCollection = () =>
  mongoose.connection.db!.collection(KnowledgeVectorModel.collection.name);

// Initialize the Vector Store
const getVectorStore = () => {
  const embeddings = createEmbeddings();
  const collection = getVectorCollection();

  return new MongoDBAtlasVectorSearch(embeddings, {
    collection: collection as any,
    indexName: VECTOR_INDEX_NAME, // The name of your Atlas Search Index
    textKey: "text",
    embeddingKey: "embedding",
  });
};

// Creates the Atlas Vector Search index if it doesn't exist. Without it, document
// search silently returns no results and the bot can't answer from its knowledge
export const ensureVectorIndex = async () => {
  const collection = getVectorCollection();
  const indexes = await collection.listSearchIndexes(VECTOR_INDEX_NAME).toArray();
  if (indexes.length > 0) return;

  await collection.createSearchIndex({
    name: VECTOR_INDEX_NAME,
    type: "vectorSearch",
    definition: {
      fields: [
        // text-embedding-3-small creates 1536-dimension vectors
        { type: "vector", path: "embedding", numDimensions: 1536, similarity: "cosine" },
        // Lets the search only look at one bot's documents
        { type: "filter", path: "botId" },
      ],
    },
  });
  console.log(
    `Created the "${VECTOR_INDEX_NAME}" vector search index, it takes about a minute to be ready`,
  );
};

// Ingestion: Split text and save vectors. Throws if it fails, so the upload isn't
// reported as saved while the bot can't actually search the document
export const addDocumentToVectorDB = async (
  text: string,
  metadata: Record<string, any> = {},
) => {
  // Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.createDocuments([text], [metadata]);

  // Store in MongoDB
  const vectorStore = getVectorStore();
  await vectorStore.addDocuments(docs);
};

// Where the conversation happens, so the answer can be formatted for it
export type Channel = "widget" | "whatsapp";

// WhatsApp doesn't render Markdown, it has its own formatting
const WHATSAPP_FORMATTING_RULES = `
FORMATTING RULES:
- You are replying in WhatsApp, which doesn't support Markdown.
- Don't use headings, tables, or [text](url) links. Write links as plain URLs.
- For emphasis use *bold* or _italic_ (single symbols), and use "-" for lists.
`;

// Rewrites a follow-up message (e.g. "what about weekends?") into a question that
// makes sense on its own, so the vector search finds the right documents
const toStandaloneQuestion = async (
  query: string,
  history: Pick<IChatMessage, "role" | "content">[],
): Promise<string> => {
  const llm = createFastChatModel();
  const transcript = history
    .map(({ role, content }) => `${role === "user" ? "User" : "Assistant"}: ${content}`)
    .join("\n");
  const response = await llm.invoke([
    {
      role: "system",
      content:
        "Rewrite the user's latest message as a standalone question that can be understood without the chat history. Keep the same language. If it is already standalone, return it unchanged. Reply with the question only.",
    },
    {
      role: "user",
      content: `Chat history:\n${transcript}\n\nLatest message: ${query}`,
    },
  ]);

  return response.content.toString().trim() || query;
};

export const askQuestion = async (
  query: string,
  bot: IBotModel,
  intents: IIntentModel[] | null,
  history: Pick<IChatMessage, "role" | "content">[] = [],
  memories: string[] = [],
  channel: Channel = "widget",
): Promise<string> => {
  const botId = bot._id.toString();
  try {
    const vectorStore = getVectorStore();
    const llm = createChatModel();

    // Filter by botId to ensure we only retrieve context for this specific bot
    const filter = {
      preFilter: {
        botId: { $eq: botId },
      },
    };
    // Retriver config
    const retriever = vectorStore.asRetriever({
      searchType: "similarity",
      filter: filter,
    });
    // Retrieve relevant documents
    // If rewriting fails (e.g. the AI provider is out of credit), search with the original message
    const searchQuery =
      history.length > 0
        ? await toStandaloneQuestion(query, history).catch((error) => {
            console.error(
              "Couldn't rewrite the follow-up question, searching with the original message:",
              error?.message,
            );
            return query;
          })
        : query;
    const relevantDocs = await retriever.invoke(searchQuery);
    // Construct context from retrieved documents
    const context = relevantDocs.map((d) => d.pageContent).join("\n\n");
    const systemPrompt = `
    You are a helpful AI assistant.

Your job is to answer the user's message using:
1. The provided intents
2. The provided context
3. The conversation history and what you remember about the user

INTENT MATCHING RULES:
- Match intents based on semantic meaning, not exact wording.
- A query matches an intent if it has the same meaning, goal, purpose, or user intention as the intent training phrases.
- Consider:
  - paraphrased questions
  - synonyms
  - alternative sentence structures
  - abbreviations
  - informal language
  - spelling mistakes and typos
  - short-form requests
  - reordered words
- Prioritize the overall user intent rather than keyword similarity.
- Even if the user's wording is completely different, use the intent if the meaning is clearly the same.

INTENT PRIORITY:
- If a user query matches an intent, ALWAYS use the intent response first.
- If multiple intents are similar, choose the one with the closest semantic meaning and user goal.
- Only use context when no intent confidently matches.

FULFILLMENT RULES:
- If the matched intent has "isFulfillment" equal to true, respond ONLY with a valid JSON object.
- Do not add explanations, markdown, text, or code fences.
- The JSON format must be:

{
  "fulfillment": true,
  "_id": "intent id",
  "webhookUrl": "webhook url from the intent",
  "webhookHeaders": {
    "key": "value"
  }
}

NORMAL RESPONSE RULES:
- If the matched intent does NOT require fulfillment, respond using the intent responses naturally and conversationally.
- Keep responses concise and relevant.

CONTEXT RULES:
- Use the provided context only if no intent matches.
- If the answer is not found in the intents, the context, the conversation history, or what you remember about the user, say:
  "I don't know."

MEMORY RULES:
- Use the conversation history to understand follow-up messages.
- Use what you remember about the user to personalize responses when relevant, for example by using their name.
- You can answer questions about the user, like their name, from what you remember about them.
${channel === "whatsapp" ? WHATSAPP_FORMATTING_RULES : ""}
IMPORTANT:
- Never invent information.
- Never create webhook URLs or headers yourself.
- Only use values provided in the matched intent.
- Return fulfillment JSON ONLY when required.

INTENTS:
${intents && intents.length > 0
  ? intents.map((intent) => `
- Name: ${intent.name}
- Training Phrases: ${intent.trainingPhrases}
- Responses: ${intent.responses}
- _id: ${intent._id}
- isFulfillment: ${intent.isFulfillment}
- webhookUrl: ${intent.webhookUrl}
- webhookHeaders: ${JSON.stringify(intent.webhookHeaders)}
`).join("\n")
  : ""}

CONTEXT:
${context}

WHAT YOU REMEMBER ABOUT THIS USER (from previous conversations):
${memories.length > 0 ? memories.map((memory) => `- ${memory}`).join("\n") : "Nothing yet."}
    `
    
//     `You are a helpful AI assistant. Use the following intents and context to answer the user's question. If the answer is not in intents or the context, say you don't know.
  
//   Intents:
//     If the user query matches one of the intent training phrases or has the same meaning or goal, take answer from the intent responses, if the intent has isFulfillment equals true, response with a json object with the following format:
// {
//     fulfillment: true,
//     _id: "intent id",
//     webhookUrl: "webhook url from the intent",
//     webhookHeaders: {
//         "key": "value" // from the intent webhook headers
//          },
// } 

//   ${intents && intents.length > 0 ? intents.map((intent) => `- Name: ${intent.name}: - Training Phrases: ${intent.trainingPhrases} - Responses: ${intent.responses} - _id: ${intent._id} - isFulfulment: ${intent.isFulfillment} - webhookUrl: ${intent.webhookUrl} - webhookHeaders: ${JSON.stringify(intent.webhookHeaders)}, `) : ""}

//   Context:
//   ${context}
  
//   `;

    // Invoke LLM with context
    const response = await llm.invoke([
      { role: "system", content: systemPrompt },
      ...history.map(({ role, content }) => ({ role, content })),
      { role: "user", content: query },
    ]);

    return response.content.toString();
  } catch (error) {
    throw error;
  }
};
