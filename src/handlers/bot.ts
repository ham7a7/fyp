import type { Request, Response } from "express";
import BotModel from "../database/schemas/bot.js";
import type { CreateBotDto } from "../dtos/bot.dto.js";
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
