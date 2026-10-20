import { Router } from "express";
import {
  getWhatsAppSettings,
  receiveWebhook,
  updateWhatsAppSettings,
  verifyWebhook,
} from "../handlers/whatsapp.js";
import validator from "../middlewares/validator.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import { updateWhatsAppSettingsValidators } from "../validators/whatsappValidators.js";

const whatsapp: Router = Router();

// Dashboard
whatsapp.get("/settings/:botId", verifyAuth, getWhatsAppSettings);
whatsapp.patch(
  "/settings",
  verifyAuth,
  updateWhatsAppSettingsValidators,
  validator,
  updateWhatsAppSettings
);

// Called by Meta
whatsapp.get("/:botId/webhook", verifyWebhook);
whatsapp.post("/:botId/webhook", receiveWebhook);

export default whatsapp;
