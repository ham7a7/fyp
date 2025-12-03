import type { Request, Response } from "express";
import mongoose from "mongoose";
import BotModel from "../database/schemas/bot.js";
import type {
  CreateBotDto,
  DeleteBotDto,
  EditBotDto,
} from "../dtos/bot.dto.js";
import { decrypt, encrypt, generateKey } from "../utils/cryptoUtils.js";

export const createBot = async (
  req: Request<{}, {}, CreateBotDto>,
  Res: Response
) => {
  const { botName, botDescription, botUsecase, botLanguage } = req.body;
  console.log(
    "Create Bot Request:",
    botName,
    botDescription,
    botUsecase,
    botLanguage
  );
  try {
    const APIKey = generateKey(16);
    const encryptedAPIKey = encrypt(APIKey);
    const publicBotId = generateKey(8);
    const encryptedBotId = encrypt(publicBotId);

    const newBot = await BotModel.create({
      name: botName,
      onwerId: (req.user as any)._id,
      description: botDescription,
      usecase: botUsecase,
      language: botLanguage,
      apiKey: encryptedAPIKey,
      publicBotId: encryptedBotId,
    });

    return Res.status(201).json({
      message: "Bot created successfully",
      bot: newBot,
      apiKey: decrypt(encryptedAPIKey),
      publicBotId: decrypt(encryptedBotId),
    });
  } catch (error) {
    return Res.status(500).json({ message: "Server error", error });
  }
};

export const deleteBot = async (
  req: Request<{}, {}, DeleteBotDto>,
  Res: Response
) => {
  const { botId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(botId)) {
      return Res.status(400).json({ message: "Invalid Bot ID" });
    }
    const bot = await BotModel.findByIdAndDelete(botId);
    if (!bot) {
      return Res.status(404).json({ message: "Bot not found" });
    }
    return Res.status(200).json({ message: "Bot deleted successfully" });
  } catch (error) {
    return Res.status(500).json({ message: "Server error", error });
  }
};

export const editBot = async (
  req: Request<{}, {}, EditBotDto>,
  Res: Response
) => {
  const { botId, botDescription, botName, botUsecase, botLanguage } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(botId)) {
      return Res.status(400).json({ message: "Invalid Bot ID" });
    }
    let updateObject: Record<string, any> = {
      name: botName,
      description: botDescription,
      usecase: botUsecase,
      language: botLanguage,
    };

    // remove properties with null or undefined values
    updateObject = Object.fromEntries(
      Object.entries(updateObject).filter(
        ([, value]) => value !== null && value !== undefined
      )
    );

    const bot = await BotModel.findByIdAndUpdate(botId, updateObject, {
      new: true,
    });
    if (!bot) {
      return Res.status(404).json({ message: "Bot not found" });
    }

    return Res.status(200).json({
      message: "Bot updated successfully",
      updatedBot: bot,
    });
  } catch (error) {
    return Res.status(500).json({ message: "Server error", error });
  }
};
