import { Router } from "express";
import { createIntent, deleteIntent, getAllIntents, getIntentWithParam, updateIntent } from "../handlers/intent.js";
import validator from "../middlewares/validator.js";
import { createIntentValidators, intentIdValidators, updateIntentValidators } from "../validators/intentValidators.js";

const intent: Router = Router();

intent.get("/",getAllIntents)
intent.post("/create", createIntentValidators, validator, createIntent);
intent.post("/update",updateIntentValidators,validator,updateIntent)
intent.delete("/delete",intentIdValidators,validator,deleteIntent),
intent.get("/:intentId",getIntentWithParam)

export default intent;
