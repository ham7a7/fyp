import { Router } from "express";
import {
  createBot,
  deleteBot,
  editBot,
  getUserBots,
  refreshAPIKey,
  refreshPublicBotId,
} from "../handlers/bot.js";
import validator from "../middlewares/validator.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import {
  botIdValidators,
  createBotValidators,
  editBotValidators,
} from "../validators/authValidators.js";

const auth: Router = Router();
auth.post("/create", verifyAuth, createBotValidators, validator, createBot);
auth.delete("/delete", verifyAuth, botIdValidators, validator, deleteBot);
auth.patch("/edit", verifyAuth, editBotValidators, validator, editBot);
auth.get("/get-bots", verifyAuth, getUserBots);
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

export default auth;
