import { Router } from "express";
import { createBot } from "../handlers/bot.js";
import validator from "../middlewares/validator.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import { createBotValidators } from "../validators/authValidators.js";

const auth: Router = Router();
auth.post("/create", verifyAuth, createBotValidators, validator, createBot);

export default auth;
