import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textSplitters";
import { config } from "dotenv";
import { mongoose } from "../database/db.js";
import KnowledgeVectorModel from "../database/schemas/knowledgeVector.js";
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
    const docs = await splitter.createDocuments([text], [{ ...metadata }]);

    // Store in MongoDB
    const vectorStore = getVectorStore();
    await vectorStore.addDocuments(docs);
  } catch (error: any) {
    return error;
  }
};
