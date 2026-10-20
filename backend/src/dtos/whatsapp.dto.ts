export interface UpdateWhatsAppSettingsDto {
  botId: string;
  enabled: boolean;
  phoneNumberId?: string;
  accessToken?: string; // only sent when it changes
  appSecret?: string; // only sent when it changes
}
