// Knowledge Document Model Interface
export interface Knowledge {
  _id: string;
  botId: string;
  ownerId: string;
  title: string;
  description?: string;
  fileUrl: string;
  originalFileName: string;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Interfaces
export interface UploadKnowledgeResponse {
  message: string;
  knowledge: Knowledge;
}

export interface GetKnowledgeListResponse {
  knowledge: Knowledge[];
}

export interface DeleteKnowledgeResponse {
  message: string;
}
