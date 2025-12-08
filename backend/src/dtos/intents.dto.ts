export interface CreateIntentDto {
  name: string;
  trainingPhrases: string[];
  responses: string[];
  isFulfillment: boolean;
  webhookUrl?: string;
  webhookHeaders?: Record<string, any>[];
}
