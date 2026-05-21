import { body, type ValidationChain } from "express-validator";

export const updateProfileValidators: ValidationChain[] = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Full name must be between 3 and 50 characters"),
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Email must be valid"),
];

export const updatePasswordValidators: ValidationChain[] = [
  body("currentPassword")
    .isString()
    .withMessage("Current password must be a string")
    .isLength({ min: 6, max: 20 })
    .withMessage("Current password must be between 6 and 20 characters"),
  body("newPassword")
    .isString()
    .withMessage("New password must be a string")
    .isLength({ min: 6, max: 20 })
    .withMessage("New password must be between 6 and 20 characters"),
];
