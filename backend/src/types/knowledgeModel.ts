export interface IKnowledgeModel {
  _id: import("mongoose").Types.ObjectId;
  botId: import("mongoose").Types.ObjectId;
  ownerId: import("mongoose").Types.ObjectId;
  title: string;
  description: string;
  fileUrl: string;
  originalFileName: string;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
}
