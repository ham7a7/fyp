import { body, type ValidationChain } from "express-validator";

export const loginValidators: ValidationChain[] = [
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least between 6 and 20 characters"),
];

export const registrationValidators: ValidationChain[] = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Full name must be at least between 3 and 50 characters"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least between 6 and 20 characters"),
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Email must be valid"),
];

export const createBotValidators: ValidationChain[] = [
  body("botName")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Bot name must be at least between 3 and 50 characters"),
  body("botDescription")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 5, max: 1000 })
    .withMessage("Description must be at least between 0 and 1000 characters"),
  body("botUsecase")
    .isString()
    .withMessage("Usecase must be a string")
    .isIn(["Website", "Mobile App", "Other"])
    .withMessage("Usecase must be one of Website, Mobile App, Other"),
  body("botLanguage").isString().withMessage("Bot language must be a string"),
];

export const botIdValidators: ValidationChain[] = [
  body("botId")
    .isString()
    .withMessage("Bot ID must be a string")
    .notEmpty()
    .withMessage("Bot ID cannot be empty"),
];

export const editBotValidators: ValidationChain[] = [
  body("botId")
    .isString()
    .withMessage("Bot ID must be a string")
    .notEmpty()
    .withMessage("Bot ID cannot be empty"),
  body("botName")
    .optional({ values: "null" })
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Bot name must be at least between 3 and 50 characters"),
  body("botDescription")
    .optional({ values: "null" })
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 5, max: 1000 })
    .withMessage("Description must be at least between 0 and 1000 characters"),
  body("botUsecase")
    .optional({ values: "null" })
    .isString()
    .withMessage("Usecase must be a string")
    .isIn(["Website", "Mobile App", "Other"])
    .withMessage("Usecase must be one of Website, Mobile App, Other"),
  body("botLanguage")
    .optional({ values: "null" })
    .isString()
    .withMessage("Bot language must be a string"),
];

export const createIntentValidators: ValidationChain[] = [
  // ----------------------------------------------------------------------
  // 1. Core Fields (name, trainingPhrases, responses)
  // ----------------------------------------------------------------------

  body("name")
    .isString()
    .withMessage("Intent name must be a string.")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Intent name must be between 3 and 100 characters."),

  body("trainingPhrases")
    .isArray({ min: 1 })
    .withMessage("Training phrases must be an array with at least one phrase.")
    .custom((phrases: string[]) => {
      // Check that every item is a non-empty string
      if (
        !phrases.every(
          (phrase) => typeof phrase === "string" && phrase.trim().length > 0
        )
      ) {
        throw new Error("All training phrases must be non-empty strings.");
      }
      return true;
    }),

  body("responses")
    .isArray({ min: 1 })
    .withMessage("Responses must be an array with at least one response.")
    .custom((responses: string[]) => {
      // Check that every item is a non-empty string
      if (
        !responses.every(
          (response) =>
            typeof response === "string" && response.trim().length > 0
        )
      ) {
        throw new Error("All responses must be non-empty strings.");
      }
      return true;
    }),

  body("isFulfillment")
    .isBoolean()
    .withMessage("isFulfillment must be a boolean.")
    .toBoolean(),

  body("webhookUrl")
    .if(body("isFulfillment").equals("true"))
    .exists()
    .withMessage("Webhook URL is required when fulfillment is enabled.")
    .isURL()
    .withMessage("Webhook URL must be a valid URL."),

  body("webhookHeaders")
    // Check ONLY if 'isFulfillment' is true
    .if(body("isFulfillment").equals("true"))
    .isArray({ min: 1 })
    .withMessage(
      "Webhook headers must be provided as a non-empty array when fulfillment is enabled."
    )
    .custom((headers: Record<string, any>[]) => {
      if (!Array.isArray(headers) || headers.length === 0) return true;

      for (const header of headers) {
        if (
          typeof header !== "object" ||
          header === null ||
          Array.isArray(header) ||
          Object.keys(header).length === 0
        ) {
          throw new Error(
            "Each webhook header must be a non-empty key-value object."
          );
        }
      }
      return true;
    }),
];
