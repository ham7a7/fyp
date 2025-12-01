import { Router } from "express";
import auth from "./auth.js";

const appRouter:Router = Router();
appRouter.use("/api/auth",auth);
// appRouter.use("/api/users",auth);
// appRouter.use("/api/intents",auth);

export default appRouter;