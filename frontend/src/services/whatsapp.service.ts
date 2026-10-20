import { apiClient } from '../lib/api-client';
import type {
  GetWhatsAppSettingsResponse,
  UpdateWhatsAppSettingsDto,
  UpdateWhatsAppSettingsResponse,
} from '../types/whatsapp';

class WhatsAppService {
  private readonly BASE_URL = '/api/whatsapp';

  /**
   * Get the WhatsApp settings of a bot
   */
  async getSettings(botId: string): Promise<GetWhatsAppSettingsResponse> {
    return await apiClient.get<GetWhatsAppSettingsResponse>(`${this.BASE_URL}/settings/${botId}`);
  }

  /**
   * Update the WhatsApp settings of a bot
   */
  async updateSettings(data: UpdateWhatsAppSettingsDto): Promise<UpdateWhatsAppSettingsResponse> {
    return await apiClient.patch<UpdateWhatsAppSettingsResponse>(`${this.BASE_URL}/settings`, data);
  }
}

export const whatsappService = new WhatsAppService();
