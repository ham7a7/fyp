import type { Request, Response } from "express";
import IntentModel from "../database/schemas/intent.js";
import type { CreateIntentDto } from "../dtos/intents.dto.js";

export const createIntent = async (
  req: Request<{}, {}, CreateIntentDto>,
  res: Response
) => {
  const {
    name,
    trainingPhrases,
    responses,
    isFulfillment,
    webhookUrl,
    webhookHeaders,
  } = req.body;

  try {
    const botId = req.bot!._id;
    const ownerId: string = (req.user as any)._id;
    const newIntent = await IntentModel.create({
      name,
      botId: botId,
      ownerId: ownerId,
      trainingPhrases,
      responses,
      isFulfillment,
      webhookUrl: webhookUrl ?? "",
      webhookHeaders: webhookHeaders ?? [],
    });

    return res.status(201).json({
      message: "Intent created successfully",
      intent: newIntent,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
