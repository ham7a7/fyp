import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export default function validator(req:Request, res:Response, next:NextFunction) {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        // Stop the request here if there are errors
        return res.status(400).json({ errors: validate.array() });
    }
    next();
}