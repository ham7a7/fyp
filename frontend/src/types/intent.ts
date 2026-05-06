// Intent Model Interface
export interface Intent {
  _id: string;
  botId: string;
  ownerId: string;
  name: string;
  trainingPhrases: string[];
  responses: string[];
  isFulfillment: boolean;
  webhookUrl: string;
  webhookHeaders: Record<string, any>[];
  createdAt: Date;
  updatedAt: Date;
}

// DTOs for API Requests
export interface CreateIntentDto {
  name: string;
  trainingPhrases: string[];
  responses: string[];
  isFulfillment: boolean;
  webhookUrl?: string;
  webhookHeaders?: Record<string, any>[];
}

export interface UpdateIntentDto {
  intentId: string;
  name?: string;
  trainingPhrases?: string[];
  responses?: string[];
  isFulfillment?: boolean;
  webhookUrl?: string;
  webhookHeaders?: Record<string, any>[];
}

export interface DeleteIntentDto {
  intentId: string;
}

export interface GetIntentDto {
  intentId: string;
}

// API Response Interfaces
export interface CreateIntentResponse {
  message: string;
  intent: Intent;
}

export interface UpdateIntentResponse {
  message: string;
  intent: Intent;
}

export interface DeleteIntentResponse {
  message: string;
}

export interface GetIntentResponse {
  intent: Intent;
}

export interface GetIntentsResponse {
  intents: Intent[];
}
