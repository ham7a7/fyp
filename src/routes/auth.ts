import { Router } from "express";
import { loginHandler, registrationHandler } from '../handlers/auth.js';
import validator from "../middlewares/validator.js";
import { loginValidators, registrationValidators } from "../validators/authValidators.js";

// TODO: Implement registration route then login route using sessions

const auth:Router = Router();
auth.post("/register",registrationValidators,validator,registrationHandler);
auth.post("/login",loginValidators,validator,loginHandler);

export default auth;