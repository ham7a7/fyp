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
    modelName: "text-embedding-3-small", // or "text-embedding-ada-002"
    apiKey: process.env.OPENAI_API_KEY!,
  });
  const collection = mongoose.connection.db!.collection(
    KnowledgeVectorModel.collection.name
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
  metadata: Record<string, any> = {}
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

export const askQuestion = async (query: string, bot:IBotModel, intents:IIntentModel[]| null) => {
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
    const systemPrompt = `You are a helpful AI assistant. Use the following intents and context to answer the user's question. If the answer is not in the context, say you don't know.
  
  Intents:
    If the user query matches one of the intent training phrases take answer from the intent intent responses.
  ${intents && intents.length > 0 ? intents.map(intent => `- Name: ${intent.name}: - Training Phrases: ${intent.trainingPhrases} - Responses: ${intent.responses}`) : ''}

  Context:
  ${context}
  
  `;

  console.log("System Prompt:", systemPrompt);
    // Invoke LLM with context
    const response = await llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ]);

    return response.content;
  } catch (error) {
    return error;
  }
};
