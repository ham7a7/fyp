import { body, type ValidationChain } from "express-validator";

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
];
