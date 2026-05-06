import type { Request, Response } from "express";
import mongoose from "mongoose";
import IntentModel from "../database/schemas/intent.js";
import type { CreateIntentDto, DeleteIntentDto, GetIntentDto, UpdateIntentDto } from "../dtos/intents.dto.js";
import type { IIntentModel } from "../types/intentModel.js";

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

export const getAllIntents = async (req: Request, res: Response) => {
  try {
    const botId = req.bot!._id;
    const ownerId = (req.user as any)._id
    
    const intents:IIntentModel[] | null = await IntentModel.find({ botId,ownerId });
    return res.status(200).json({ intents });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}


export const updateIntent = async (
  req: Request<{}, {}, UpdateIntentDto>,
  res: Response
) => {
  const { intentId,isFulfillment,name,responses,trainingPhrases,webhookHeaders,webhookUrl } = req.body;
  const botId =  req.bot!._id;
    const ownerId: string = (req.user as any)._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(intentId)) {
      return res.status(400).json({ message: "Invalid intent ID" });
    }
    let updateObject: Record<string, any> = {
      isFulfillment,
      name,
      responses,
      trainingPhrases,
      webhookHeaders,
      webhookUrl,
    };

    // remove properties with null or undefined values
    updateObject = Object.fromEntries(
      Object.entries(updateObject).filter(
        ([, value]) => value !== null && value !== undefined
      )
    );

    const intent = await IntentModel.findOneAndUpdate(
      { _id: intentId, botId,ownerId },
      updateObject,
      {
        new: true,
      }
    );
    if (!intent) {
      return res.status(404).json({ message: "Intent not found" });
    }

    return res.status(200).json({
      message: "Intent updated successfully",
      updatedIntent: intent,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


export const deleteIntent = async (
  req: Request<{}, {}, DeleteIntentDto>,
  res: Response
) => {
  const {intentId} = req.body;
  const  botId  = req.bot!._id;
  const ownerId = (req.user as any)._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(intentId)) {
      return res.status(400).json({ message: "Invalid Intent ID" });
    }
    const intent = await IntentModel.findOneAndDelete({
      _id: intentId,
      botId,
      ownerId: ownerId,
    });
    if (!intent) {
      return res.status(404).json({ message: "Intent not found" });
    }
    return res.status(200).json({ message: "Intent deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getIntent = async (
  req: Request<{}, {}, GetIntentDto>,
  res: Response
) => {
  try {
    const intentId  = req.intent!._id;
    const botId= req.bot!._id;
    const ownerId = (req.user as any)._id;
    const intent: IIntentModel | null = await IntentModel.findOne({
      _id: intentId,
      botId,
      ownerId,
    });
    if (!intent) {
      return res.status(404).json({ message: "Intent not found" });
    }
    return res.status(200).json({ intent });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getIntentWithParam = async (req: Request, res: Response) => {
  try {
    const { intentId } = req.params;
    const botId = req.bot!._id;
    if (!intentId || !mongoose.Types.ObjectId.isValid(intentId)) {
      return res.status(400).json({ message: "Invalid Intent ID" });
    }
    const ownerId = (req.user as any)._id;
    const intent: IIntentModel | null = await IntentModel.findOne({
      _id: intentId,
      botId,
       ownerId,
    });
    if (!intent) {
      return res.status(404).json({ message: "Intent not found" });
    }
    return res.status(200).json({ intent });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};