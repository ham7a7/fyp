import axios from "axios";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import BotModel from "../database/schemas/bot.js";
import IntentModel from "../database/schemas/intent.js";
import type {
  BotIdDto,
  ChatWithBotDto,
  CreateBotDto,
  DeleteBotDto,
  EditBotDto,
} from "../dtos/bot.dto.js";
import type { IBotModel } from "../types/botModel.js";
import type { IIntentModel } from "../types/intentModel.js";
import { decrypt, encrypt, generateKey } from "../utils/cryptoUtils.js";
import { askQuestion } from "../utils/ragUtils.js";

export const createBot = async (
  req: Request<{}, {}, CreateBotDto>,
  res: Response,
) => {
  const { botName, botDescription, botUsecase, botLanguage } = req.body;
  try {
    const APIKey = generateKey(16);
    const encryptedAPIKey = encrypt(APIKey);
    const publicBotId = generateKey(8);

    const newBot = await BotModel.create({
      name: botName,
      ownerId: (req.user as any)._id,
      description: botDescription,
      usecase: botUsecase,
      language: botLanguage,
      apiKey: encryptedAPIKey,
      publicBotId: publicBotId,
    });

    return res.status(201).json({
      message: "Bot created successfully",
      bot: newBot,
      apiKey: decrypt(encryptedAPIKey),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteBot = async (
  req: Request<{}, {}, DeleteBotDto>,
  res: Response,
) => {
  const { botId } = req.body;
  const ownerId = (req.user as any)._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(botId)) {
      return res.status(400).json({ message: "Invalid Bot ID" });
    }
    const bot = await BotModel.findOneAndDelete({
      _id: botId,
      ownerId: ownerId,
    });
    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }
    return res.status(200).json({ message: "Bot deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const editBot = async (
  req: Request<{}, {}, EditBotDto>,
  res: Response,
) => {
  const {
    botId,
    botDescription,
    botName,
    botUsecase,
    botLanguage,
    widgetHeaderName,
    widgetPrimaryColor,
    widgetDarkMode,
    widgetWelcomeTitle,
    widgetWelcomeMessage,
  } = req.body;
  const ownerId = (req.user as any)._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(botId)) {
      return res.status(400).json({ message: "Invalid Bot ID" });
    }
    let updateObject: Record<string, any> = {
      name: botName,
      description: botDescription,
      usecase: botUsecase,
      language: botLanguage,
    };

    const widgetUpdates: Record<string, any> = {};
    if (widgetHeaderName !== undefined && widgetHeaderName !== null) {
      widgetUpdates["widgetSettings.headerName"] = widgetHeaderName;
    }
    if (widgetPrimaryColor !== undefined && widgetPrimaryColor !== null) {
      widgetUpdates["widgetSettings.primaryColor"] = widgetPrimaryColor;
    }
    if (widgetDarkMode !== undefined && widgetDarkMode !== null) {
      widgetUpdates["widgetSettings.darkMode"] = widgetDarkMode;
    }
    if (widgetWelcomeTitle !== undefined && widgetWelcomeTitle !== null) {
      widgetUpdates["widgetSettings.welcomeTitle"] = widgetWelcomeTitle;
    }
    if (widgetWelcomeMessage !== undefined && widgetWelcomeMessage !== null) {
      widgetUpdates["widgetSettings.welcomeMessage"] = widgetWelcomeMessage;
    }

    // remove properties with null or undefined values
    updateObject = Object.fromEntries(
      Object.entries(updateObject).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    );

    updateObject = {
      ...updateObject,
      ...widgetUpdates,
    };

    const bot = await BotModel.findOneAndUpdate(
      { _id: botId, ownerId: ownerId },
      updateObject,
      {
        new: true,
      },
    );
    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    return res.status(200).json({
      message: "Bot updated successfully",
      updatedBot: bot,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getWidgetSettingsByPublicId = async (
  req: Request<{ publicBotId: string }>,
  res: Response,
) => {
  try {
    const { publicBotId } = req.params;
    if (!publicBotId) {
      return res.status(400).json({ message: "Public Bot ID is required" });
    }

    const bot = await BotModel.findOne({ publicBotId }).select({
      name: 1,
      widgetSettings: 1,
    });

    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    const widgetSettings = {
      headerName: bot.widgetSettings?.headerName ?? "AI Assistant",
      primaryColor: bot.widgetSettings?.primaryColor ?? "#667eea",
      darkMode: bot.widgetSettings?.darkMode ?? false,
      welcomeTitle: bot.widgetSettings?.welcomeTitle ?? "Welcome!",
      welcomeMessage:
        bot.widgetSettings?.welcomeMessage ??
        "Hi there! How can I help you today?",
    };

    return res.status(200).json({
      botName: bot.name,
      widgetSettings,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getUserBot = async (
  req: Request<{}, {}, BotIdDto>,
  res: Response,
) => {
  try {
    const { botId } = req.body;
    const ownerId = (req.user as any)._id;
    const bot: IBotModel | null = await BotModel.findOne({
      _id: botId,
      ownerId: ownerId,
    });
    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }
    return res.status(200).json({ bot });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
export const getUserBotWithParam = async (req: Request, res: Response) => {
  try {
    const { botId } = req.params;
    if (!botId || !mongoose.Types.ObjectId.isValid(botId)) {
      return res.status(400).json({ message: "Invalid Bot ID" });
    }
    const ownerId = (req.user as any)._id;
    const bot: IBotModel | null = await BotModel.findOne({
      _id: botId,
      ownerId: ownerId,
    });
    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }
    return res.status(200).json({ bot });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getUserBots = async (req: Request, res: Response) => {
  try {
    const ownerId = (req.user as any)._id;
    let bots: IBotModel[] = await BotModel.find({ ownerId });

    bots = bots.map((bot) => {
      bot.apiKey = decrypt(bot.apiKey.toString());
      return bot;
    });
    return res.status(200).json({ bots });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const refreshAPIKey = async (
  req: Request<{}, {}, BotIdDto>,
  res: Response,
) => {
  const { botId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(botId)) {
    return res.status(400).json({ message: "Invalid Bot ID" });
  }
  try {
    const APIKey = generateKey(16);
    const encryptedAPIKey = encrypt(APIKey);

    const updatedBot = await BotModel.findByIdAndUpdate(
      botId,
      { apiKey: encryptedAPIKey },
      { new: true },
    );

    if (!updatedBot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    return res.status(200).json({
      message: "API Key refreshed successfully",
      bot: updatedBot,
      apiKey: decrypt(encryptedAPIKey),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const refreshPublicBotId = async (
  req: Request<{}, {}, BotIdDto>,
  res: Response,
) => {
  const { botId } = req.body;
  const ownerId = (req.user as any)._id;
  if (!mongoose.Types.ObjectId.isValid(botId)) {
    return res.status(400).json({ message: "Invalid Bot ID" });
  }
  try {
    const newPublicBotId = generateKey(8);

    const updatedBot = await BotModel.findOneAndUpdate(
      { _id: botId, ownerId: ownerId },
      { publicBotId: newPublicBotId },
      { new: true },
    );

    if (!updatedBot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    return res.status(200).json({
      message: "Public bot id refreshed successfully",
      bot: updatedBot,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const chatWithBot = async (
  req: Request<{}, {}, ChatWithBotDto>,
  res: Response,
) => {
  // TODO: Validate origin of the request
  const { message, publicBotId } = req.body;
  const bot = await BotModel.findOne({ publicBotId: publicBotId });
  if (!bot) {
    return res.status(404).json({ message: "Bot not found" });
  }

  const intents: IIntentModel[] | null = await IntentModel.find({
    botId: bot._id,
    ownerId: bot.ownerId,
  }).select({
    name: 1,
    _id: 1,
    trainingPhrases: 1,
    responses: 1,
    isFulfillment: 1,
    webhookUrl: 1,
    webhookHeaders: 1,
  });
  try {
    let answer = await askQuestion(message, bot, intents);
    console.log("Answer:", answer);
    answer = await handleWebhook(message, answer);
    console.log("Answer:", answer);

    res.json({ response: answer });
  } catch (error: any) {
    console.error("Error in chatWithBot:", error?.message);
    res.status(500).json({
      message: "An error occurred while processing the request",
      error: error?.message,
    });
  }
};

const handleWebhook = async (message: string, AIAnswer: string) => {
  const answer = AIAnswer;
  if (
    answer &&
    typeof answer === "string" &&
    answer.includes("fulfillment") &&
    answer.includes("webhookUrl")
  ) {
    const fulfillmentData = JSON.parse(answer);
    if (
      fulfillmentData &&
      fulfillmentData.fulfillment &&
      fulfillmentData.webhookUrl
    ) {
      // Call the webhook with the necessary data
      const intent = await IntentModel.findById(fulfillmentData._id);
      if (intent) {
        const res = await axios.post(
          fulfillmentData.webhookUrl,
          {
            query: message,
            intentId: fulfillmentData._id,
            webhookHeaders: fulfillmentData.webhookHeaders,
          },
          {
            headers: fulfillmentData.webhookHeaders,
          },
        );
        if (!res.data || !res.data.response) {
          throw new Error(
            "Invalid response from webhook, missing 'response' field",
          );
        }
        return res.data.response;
      }
    }
  }
  return answer;
};
