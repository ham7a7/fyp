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
