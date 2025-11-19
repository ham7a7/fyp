import { Router } from "express";
import auth from "./auth.js";

const appRouter:Router = Router();
appRouter.use("/auth",auth);
// appRouter.use("/users",auth);
// appRouter.use("/intents",auth);

export default appRouter;