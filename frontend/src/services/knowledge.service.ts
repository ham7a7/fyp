import { apiClient } from '../lib/api-client';
import type {
    DeleteKnowledgeResponse,
    GetKnowledgeListResponse,
    UploadKnowledgeResponse,
} from '../types/knowledge';

class KnowledgeService {
  /**
   * Get the base URL for knowledge operations
   * Knowledge is nested under bots: /api/bots/:botId/knowledge
   */
  private getBaseUrl(botId: string): string {
    return `api/bots/${botId}/knowledge`;
  }

  /**
   * Upload a knowledge document
   */
  async uploadDocument(botId: string, file: File): Promise<UploadKnowledgeResponse> {
    const formData = new FormData();
    formData.append('document', file);

    return await apiClient.post<UploadKnowledgeResponse>(
      `${this.getBaseUrl(botId)}/save`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  /**
   * Get all knowledge documents for a bot
   */
  async getAllDocuments(botId: string): Promise<GetKnowledgeListResponse> {
    return await apiClient.get<GetKnowledgeListResponse>(this.getBaseUrl(botId));
  }

  /**
   * Delete a knowledge document
   */
  async deleteDocument(botId: string, knowledgeId: string): Promise<DeleteKnowledgeResponse> {
    return await apiClient.delete<DeleteKnowledgeResponse>(
      `${this.getBaseUrl(botId)}/${knowledgeId}`
    );
  }
}

export const knowledgeService = new KnowledgeService();
