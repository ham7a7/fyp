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