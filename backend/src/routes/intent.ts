import { Router } from "express";
import { createIntent } from "../handlers/intent.js";
import validator from "../middlewares/validator.js";
import { createIntentValidators } from "../validators/intentValidators.js";

const intent: Router = Router();

intent.post("/create", createIntentValidators, validator, createIntent);

export default intent;
