import { Router } from "express";
import {
    chatWithBot,
    createBot,
    deleteBot,
    editBot,
    getUserBot,
    getUserBots,
    getUserBotWithParam,
    getWidgetSettingsByPublicId,
    refreshAPIKey,
    refreshPublicBotId,
} from "../handlers/bot.js";
import validator from "../middlewares/validator.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import {
    botIdValidators,
    chatWithBotValidators,
    createBotValidators,
    editBotValidators,
    publicBotIdParamValidators,
} from "../validators/botValidators.js";

const auth: Router = Router();
auth.post("/create", verifyAuth, createBotValidators, validator, createBot);
auth.delete("/delete", verifyAuth, botIdValidators, validator, deleteBot);
auth.patch("/edit", verifyAuth, editBotValidators, validator, editBot);
auth.post("/get-bot", verifyAuth, botIdValidators, validator, getUserBot);
auth.get("/get-bots", verifyAuth, getUserBots);
auth.get("/bot/:botId", verifyAuth, getUserBotWithParam);
auth.get(
  "/widget/:publicBotId",
  publicBotIdParamValidators,
  validator,
  getWidgetSettingsByPublicId
);
auth.patch(
  "/refresh-api-key",
  verifyAuth,
  botIdValidators,
  validator,
  refreshAPIKey
);
auth.patch(
  "/refresh-bot-id",
  verifyAuth,
  botIdValidators,
  validator,
  refreshPublicBotId
);

auth.post(
  "/chat-with-bot",
  chatWithBotValidators,
  validator,
  chatWithBot
);

export default auth;
