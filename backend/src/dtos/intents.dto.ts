import type { webhookHeaders } from "../types/intentModel.js";

export interface CreateIntentDto {
  name: string;
  trainingPhrases: string[];
  responses: string[];
  isFulfillment: boolean;
  webhookUrl?: string;
  webhookHeaders?: webhookHeaders[];
}

export interface UpdateIntentDto {
  intentId: string;
  name?: string;
  trainingPhrases?: string[];
  responses?: string[];
  isFulfillment?: boolean;
  webhookUrl?: string;
  webhookHeaders?: webhookHeaders[];
}

export interface DeleteIntentDto {
  intentId: string;
}

export interface GetIntentDto {
  intentId: string;
}
