import { body, param, type ValidationChain } from "express-validator";

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
    .notEmpty()
    .withMessage("Usecase must not be empty"),
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
    .notEmpty()
    .withMessage("Usecase must not be empty"),
  body("botLanguage")
    .optional({ values: "null" })
    .isString()
    .withMessage("Bot language must be a string"),
  body("widgetHeaderName")
    .optional({ values: "null" })
    .isString()
    .withMessage("Widget header name must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Widget header name must be between 1 and 100 characters"),
  body("widgetPrimaryColor")
    .optional({ values: "null" })
    .isString()
    .withMessage("Widget primary color must be a string")
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage("Widget primary color must be a valid hex color"),
  body("widgetDarkMode")
    .optional({ values: "null" })
    .isBoolean()
    .withMessage("Widget dark mode must be a boolean"),
  body("widgetWelcomeTitle")
    .optional({ values: "null" })
    .isString()
    .withMessage("Widget welcome title must be a string")
    .isLength({ min: 1, max: 120 })
    .withMessage("Widget welcome title must be between 1 and 120 characters"),
  body("widgetWelcomeMessage")
    .optional({ values: "null" })
    .isString()
    .withMessage("Widget welcome message must be a string")
    .isLength({ min: 1, max: 300 })
    .withMessage("Widget welcome message must be between 1 and 300 characters"),
];

export const chatWithBotValidators: ValidationChain[] = [
  body("publicBotId")
    .isString()
    .withMessage("Bot ID must be a string")
    .notEmpty()
    .withMessage("Bot ID cannot be empty"),
  body("message")
    .isString()
    .withMessage("Bot ID must be a string")
    .notEmpty()
    .withMessage("Bot ID cannot be empty"),
  body("conversationId")
    .optional({ values: "null" })
    .isMongoId()
    .withMessage("Conversation ID must be a valid ID"),
  body("visitorId")
    .optional({ values: "null" })
    .isString()
    .withMessage("Visitor ID must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Visitor ID must be between 1 and 100 characters"),
];

export const chatHistoryValidators: ValidationChain[] = [
  body("publicBotId")
    .isString()
    .withMessage("Bot ID must be a string")
    .notEmpty()
    .withMessage("Bot ID cannot be empty"),
  body("conversationId")
    .isMongoId()
    .withMessage("Conversation ID must be a valid ID"),
  body("visitorId")
    .isString()
    .withMessage("Visitor ID must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Visitor ID must be between 1 and 100 characters"),
];

export const publicBotIdParamValidators: ValidationChain[] = [
  param("publicBotId")
    .isString()
    .withMessage("Public Bot ID must be a string")
    .notEmpty()
    .withMessage("Public Bot ID cannot be empty"),
];
