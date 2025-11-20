import { Router } from "express";
import { loginHandler } from '../handlers/auth.js';
import validator from "../middlewares/validator.js";
import { loginValidators } from "../validators/authValidators.js";


const auth:Router = Router();

auth.post("/login",loginValidators,validator,loginHandler);

export default auth;