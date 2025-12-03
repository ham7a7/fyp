import { Router } from "express";
import { createBot, deleteBot, editBot } from "../handlers/bot.js";
import validator from "../middlewares/validator.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import {
  createBotValidators,
  deleteBotValidators,
  editBotValidators,
} from "../validators/authValidators.js";

const auth: Router = Router();
auth.post("/create", verifyAuth, createBotValidators, validator, createBot);
auth.delete("/delete", verifyAuth, deleteBotValidators, validator, deleteBot);
auth.patch("/edit", verifyAuth, editBotValidators, validator, editBot);

export default auth;
