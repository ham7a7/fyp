import { Router, type Request, type Response } from "express";
import passport from "passport";
import {
  getCurrentUser,
  loginHandler,
  logout,
  registrationHandler,
} from "../handlers/auth.js";
import validator from "../middlewares/validator.js";
import {
  loginValidators,
  registrationValidators,
} from "../validators/authValidators.js";

const auth: Router = Router();
auth.post("/register", registrationValidators, validator, registrationHandler);
auth.post(
  "/login",
  loginValidators,
  validator,
  passport.authenticate("local"),
  loginHandler,
);
auth.post("/logout", logout);
auth.get("/me", getCurrentUser);

auth.post("/test-fyp", (req: Request, res: Response) => {
  console.log("Received request body :", req.body);
  res.json({ hi: "Try wehbhook ?" });
});

export default auth;
