import { body, type ValidationChain } from "express-validator";

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
          (phrase) => typeof phrase === "string" && phrase.trim().length > 0,
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
            typeof response === "string" && response.trim().length > 0,
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
    .isURL({ require_tld: false, require_protocol: true })
    .withMessage("Webhook URL must be a valid URL."),

  body("webhookHeaders")
    // Check ONLY if 'isFulfillment' is true
    .if(body("isFulfillment").equals("true"))
    .isArray({ min: 1 })
    .withMessage(
      "Webhook headers must be provided as a non-empty array when fulfillment is enabled.",
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
            "Each webhook header must be a non-empty key-value object.",
          );
        }
      }
      return true;
    }),
];

export const updateIntentValidators: ValidationChain[] = [
  body("intentId")
    .isString()
    .withMessage("Intent ID must be a string.")
    .notEmpty()
    .withMessage("Intent ID cannot be empty."),

  body("name")
    .optional({ values: "null" })
    .isString()
    .withMessage("Intent name must be a string.")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Intent name must be between 3 and 100 characters."),

  body("trainingPhrases")
    .optional({ values: "null" })
    .isArray({ min: 1 })
    .withMessage("Training phrases must be an array with at least one phrase.")
    .custom((phrases: string[]) => {
      // Check that every item is a non-empty string
      if (
        !phrases.every(
          (phrase) => typeof phrase === "string" && phrase.trim().length > 0,
        )
      ) {
        throw new Error("All training phrases must be non-empty strings.");
      }
      return true;
    }),

  body("responses")
    .optional({ values: "null" })
    .isArray({ min: 1 })
    .withMessage("Responses must be an array with at least one response.")
    .custom((responses: string[]) => {
      // Check that every item is a non-empty string
      if (
        !responses.every(
          (response) =>
            typeof response === "string" && response.trim().length > 0,
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
    .isURL({ require_tld: false, require_protocol: true })
    .withMessage("Webhook URL must be a valid URL."),

  body("webhookHeaders")
    // Check ONLY if 'isFulfillment' is true
    .if(body("isFulfillment").equals("true"))
    .isArray({ min: 1 })
    .withMessage(
      "Webhook headers must be provided as a non-empty array when fulfillment is enabled.",
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
            "Each webhook header must be a non-empty key-value object.",
          );
        }
      }
      return true;
    }),
];

export const intentIdValidators: ValidationChain[] = [
  body("intentId")
    .isString()
    .withMessage("Intent ID must be a string")
    .notEmpty()
    .withMessage("Intent ID cannot be empty"),
];
