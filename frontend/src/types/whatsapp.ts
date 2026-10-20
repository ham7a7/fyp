// WhatsApp settings as returned by the API (secrets are never sent back)
export interface WhatsAppSettings {
  enabled: boolean;
  phoneNumberId: string;
  verifyToken: string;
  hasAccessToken: boolean;
  hasAppSecret: boolean;
}

// DTOs for API Requests
export interface UpdateWhatsAppSettingsDto {
  botId: string;
  enabled: boolean;
  phoneNumberId: string;
  accessToken?: string; // only sent when it changes
  appSecret?: string; // only sent when it changes
}

// API Response Interfaces
export interface GetWhatsAppSettingsResponse {
  whatsappSettings: WhatsAppSettings;
}

export interface UpdateWhatsAppSettingsResponse {
  message: string;
  whatsappSettings: WhatsAppSettings;
}
