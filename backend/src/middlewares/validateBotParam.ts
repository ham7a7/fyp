import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import BotModel from "../database/schemas/bot.js";
import type { IBotModel } from "../types/botModel.js";

export const validateBotParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    req.bot = bot;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
