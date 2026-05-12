import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { config } from "dotenv";
import { mongoose } from "../database/db.js";
import KnowledgeVectorModel from "../database/schemas/knowledgeVector.js";
import type { IBotModel } from "../types/botModel.js";
import type { IIntentModel } from "../types/intentModel.js";
config();

// Initialize the Vector Store
const getVectorStore = () => {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY!,
  });
  const collection = mongoose.connection.db!.collection(
    KnowledgeVectorModel.collection.name,
  );

  return new MongoDBAtlasVectorSearch(embeddings, {
    collection: collection as any,
    indexName: "vector_index", // The name of your Atlas Search Index
    textKey: "text",
    embeddingKey: "embedding",
  });
};

// Ingestion: Split text and save vectors
export const addDocumentToVectorDB = async (
  text: string,
  metadata: Record<string, any> = {},
) => {
  try {
    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.createDocuments([text], [metadata]);

    // Store in MongoDB
    const vectorStore = getVectorStore();
    await vectorStore.addDocuments(docs);
  } catch (error: any) {
    return error;
  }
};

export const askQuestion = async (
  query: string,
  bot: IBotModel,
  intents: IIntentModel[] | null,
): Promise<string> => {
  const botId = bot._id.toString();
  try {
    const vectorStore = getVectorStore();
    const llm = new ChatOpenAI({ modelName: "gpt-4o" });

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
    const relevantDocs = await retriever.invoke(query);
    // Construct context from retrieved documents
    const context = relevantDocs.map((d) => d.pageContent).join("\n\n");
    const systemPrompt = `
    You are a helpful AI assistant.

Your job is to answer the user's message using:
1. The provided intents
2. The provided context

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
- If the answer is not found in either intents or context, say:
  "I don't know."

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
      { role: "user", content: query },
    ]);

    return response.content.toString();
  } catch (error) {
    throw error;
  }
};
