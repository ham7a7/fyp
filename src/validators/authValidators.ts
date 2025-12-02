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
    .withMessage("Full name must be at least between 3 and 50 characters"),
  body("botDescription")
    .isEmpty()
    .withMessage("Bot name must not be empty")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 0, max: 1000 })
    .withMessage("Description must be at least between 0 and 1000 characters"),
  body("botUsecase")
    .isString()
    .withMessage("Usecase must be a string")
    .isIn(["Website", "Mobile App", "Other"])
    .withMessage("Usecase must be one of Website, Mobile App, Other"),
  body("botLanguage")
    .isEmpty()
    .withMessage("Bot name must not be empty")
    .isString()
    .withMessage("Language must be a string"),
];
