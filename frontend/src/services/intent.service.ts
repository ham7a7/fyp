import { apiClient } from '../lib/api-client';
import type {
  CreateIntentDto,
  CreateIntentResponse,
  DeleteIntentDto,
  DeleteIntentResponse,
  GetIntentResponse,
  GetIntentsResponse,
  UpdateIntentDto,
  UpdateIntentResponse
} from '../types/intent';

class IntentService {
  /**
   * Get the base URL for intent operations
   * Intents are nested under bots: /api/bots/:botId/intents
   */
  private getBaseUrl(botId: string): string {
    return `api/bots/${botId}/intents`;
  }

  /**
   * Create a new intent for a bot
   */
  async createIntent(botId: string, data: CreateIntentDto): Promise<CreateIntentResponse> {
    return await apiClient.post<CreateIntentResponse>(`${this.getBaseUrl(botId)}/create`, data);
  }

  /**
   * Update an existing intent
   */
  async updateIntent(botId: string, data: UpdateIntentDto): Promise<UpdateIntentResponse> {
    return await apiClient.post<UpdateIntentResponse>(`${this.getBaseUrl(botId)}/update`, data);
  }

  /**
   * Delete an intent
   */
  async deleteIntent(botId: string, data: DeleteIntentDto): Promise<DeleteIntentResponse> {
    return await apiClient.delete<DeleteIntentResponse>(`${this.getBaseUrl(botId)}/delete`, { data });
  }

  /**
   * Get a specific intent by ID
   */
  async getIntent(botId: string, intentId: string): Promise<GetIntentResponse> {
    return await apiClient.get<GetIntentResponse>(`${this.getBaseUrl(botId)}/${intentId}`);
  }

  /**
   * Get all intents for a bot
   */
  async getAllIntents(botId: string): Promise<GetIntentsResponse> {
    return await apiClient.get<GetIntentsResponse>(this.getBaseUrl(botId));
  }
}

export const intentService = new IntentService();
