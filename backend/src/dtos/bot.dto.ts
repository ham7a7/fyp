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
}

export interface BotIdDto {
  botId: string;
}
