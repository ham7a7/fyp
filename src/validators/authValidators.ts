import { body, type ValidationChain } from "express-validator";

export const loginValidators:ValidationChain[] = [
    body("username").isString().withMessage("Username must be a string").isLength({ min: 3,max:20 }).withMessage("Username must be at least between 3 and 20 characters"),
    body("password").isString().withMessage("Password must be a string").isLength({ min: 6,max:20 }).withMessage("Password must be at least between 6 and 20 characters"),
]