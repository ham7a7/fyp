// Bot Model Interface
export interface Bot {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  usecase: string;
  language: string;
  status: string;
  origins?: string[];
  publicBotId: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs for API Requests
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

export interface ChatWithBotDto {
  publicBotId: string;
  message: string;
}

// API Response Interfaces
export interface CreateBotResponse {
  message: string;
  bot: Bot;
  apiKey: string;
}

export interface DeleteBotResponse {
  message: string;
}

export interface EditBotResponse {
  message: string;
  updatedBot: Bot;
}

export interface GetBotResponse {
  bot: Bot;
}

export interface GetBotsResponse {
  bots: Bot[];
}

export interface RefreshAPIKeyResponse {
  message: string;
  bot: Bot;
  apiKey: string;
}

export interface RefreshBotIdResponse {
  message: string;
  bot: Bot;
}

export interface ChatBotResponse {
  response: string;
}
