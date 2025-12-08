import type { NextFunction, Request, Response } from "express";


export const verifyAuth = (req:Request, res:Response, next:NextFunction) => {
    if ((req.isAuthenticated && req.isAuthenticated()) && req.user) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
}