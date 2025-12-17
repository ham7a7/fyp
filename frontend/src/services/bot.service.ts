import { apiClient } from '../lib/api-client';
import type {
    BotIdDto,
    ChatBotResponse,
    ChatWithBotDto,
    CreateBotDto,
    CreateBotResponse,
    DeleteBotDto,
    DeleteBotResponse,
    EditBotDto,
    EditBotResponse,
    GetBotResponse,
    GetBotsResponse,
    RefreshAPIKeyResponse,
    RefreshBotIdResponse,
} from '../types/bot';

class BotService {
  private readonly BASE_URL = '/api/bots';

  /**
   * Create a new bot
   */
  async createBot(data: CreateBotDto): Promise<CreateBotResponse> {
    return await apiClient.post<CreateBotResponse>(`${this.BASE_URL}/create`, data);
  }

  /**
   * Delete a bot by ID
   */
  async deleteBot(data: DeleteBotDto): Promise<DeleteBotResponse> {
    return await apiClient.delete<DeleteBotResponse>(`${this.BASE_URL}/delete`, { data });
  }

  /**
   * Edit/Update a bot
   */
  async editBot(data: EditBotDto): Promise<EditBotResponse> {
    return await apiClient.patch<EditBotResponse>(`${this.BASE_URL}/edit`, data);
  }

  /**
   * Get a specific bot by ID
   */
  async getBot(data: BotIdDto): Promise<GetBotResponse> {
    return await apiClient.post<GetBotResponse>(`${this.BASE_URL}/get-bot`, data);
  }

  /**
   * Get bot using URL parameter
   */
  async getBotWithParam(botId: string): Promise<GetBotResponse> {
    return await apiClient.get<GetBotResponse>(`${this.BASE_URL}/bot/${botId}`);
  }

  /**
   * Get all bots for the authenticated user
   */
  async getAllBots(): Promise<GetBotsResponse> {
    return await apiClient.get<GetBotsResponse>(`${this.BASE_URL}/get-bots`);
  }

  /**
   * Refresh the API key for a bot
   */
  async refreshAPIKey(data: BotIdDto): Promise<RefreshAPIKeyResponse> {
    return await apiClient.patch<RefreshAPIKeyResponse>(`${this.BASE_URL}/refresh-api-key`, data);
  }

  /**
   * Refresh the public bot ID
   */
  async refreshPublicBotId(data: BotIdDto): Promise<RefreshBotIdResponse> {
    return await apiClient.patch<RefreshBotIdResponse>(`${this.BASE_URL}/refresh-bot-id`, data);
  }

  /**
   * Chat with a bot using its public ID
   */
  async chatWithBot(data: ChatWithBotDto): Promise<ChatBotResponse> {
    return await apiClient.post<ChatBotResponse>(`${this.BASE_URL}/chat-with-bot`, data);
  }
}

export const botService = new BotService();
