import { Router } from "express";
import auth from "./auth.js";
import bot from "./bot.js";

const appRouter: Router = Router();
appRouter.use("/api/auth", auth);
appRouter.use("/api/bots", bot);
appRouter.use("/api/intents", auth);

export default appRouter;
