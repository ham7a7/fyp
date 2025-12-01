import type { Request, Response } from "express";
import type { LoginDto, RegistrationDto } from "../dtos/auth.dto.js"; // this will be merges


export const loginHandler = (req:Request<{}, {}, LoginDto>,res:Response)=>{
    const { username, password } = req.body;
    console.log("Login Attempt:", username, password);
    res.send("Login Route here")
}

export const registrationHandler = (req:Request<{}, {}, RegistrationDto>,res:Response)=>{
    const { name, password, email } = req.body;
    console.log(req.session);
    console.log(req.sessionID);
    console.log("Registration Attempt:", name, password, email);
    res.status(200).send("Registration Route here")
}
