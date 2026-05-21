import { Router } from "express";
import { validateBotParam } from "../middlewares/validateBotParam.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import auth from "./auth.js";
import bot from "./bot.js";
import intent from "./intent.js";
import knowledge from "./knowledge.js";
import users from "./users.js";

const appRouter: Router = Router();
appRouter.use("/api/auth", auth);
appRouter.use("/api/users", users);
appRouter.use("/api/bots", bot);
appRouter.use("/api/bots/:botId/intents", verifyAuth, validateBotParam, intent);
appRouter.use(
  "/api/bots/:botId/knowledge",
  verifyAuth,
  validateBotParam,
  knowledge
);

export default appRouter;
