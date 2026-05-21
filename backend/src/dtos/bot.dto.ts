export interface CreateBotDto {
  botName: string;
  botDescription: string;
  botUsecase: string;
  botLanguage: string;
}

export interface DeleteBotDto {
  botId: string;
}

export interface EditBotDto {
  botId: string;
  botName?: string;
  botDescription?: string;
  botUsecase?: string;
  botLanguage?: string;
  widgetHeaderName?: string;
  widgetPrimaryColor?: string;
  widgetDarkMode?: boolean;
  widgetWelcomeTitle?: string;
  widgetWelcomeMessage?: string;
}

export interface BotIdDto {
  botId: string;
}
export interface ChatWithBotDto {
  publicBotId: string;
  message: string;
}
