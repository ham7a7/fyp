import type { Request, Response } from "express";
import type { LoginDto } from "../dtos/login.dto.js";

export const loginHandler = (req:Request<{}, {}, LoginDto>,res:Response)=>{
    const { username, password } = req.body;
    console.log("Login Attempt:", username, password);
    res.send("Login Route here")
}
