import { body, type ValidationChain } from "express-validator";

export const updateWhatsAppSettingsValidators: ValidationChain[] = [
  body("botId").isMongoId().withMessage("Bot ID must be a valid ID"),
  body("enabled").isBoolean().withMessage("Enabled must be a boolean"),
  body("phoneNumberId")
    .optional({ values: "null" })
    .isString()
    .withMessage("Phone number ID must be a string")
    .trim()
    .matches(/^\d*$/)
    .withMessage("Phone number ID must contain only digits"),
  body("accessToken")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Access token must be a string")
    .trim()
    .matches(/^EAA[A-Za-z0-9]+$/)
    .withMessage(
      "This isn't a Meta access token. It starts with \"EAA\" and is about 200 characters long (WhatsApp > API Setup in Meta)",
    )
    .isLength({ max: 1000 })
    .withMessage("Access token is too long"),
  body("appSecret")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("App secret must be a string")
    .trim()
    .matches(/^[0-9a-fA-F]{32}$/)
    .withMessage(
      "This isn't an app secret. It's 32 letters and numbers (App settings > Basic in Meta)",
    ),
];
