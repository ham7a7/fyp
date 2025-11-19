import type { Request, Response } from "express"

export const loginHandler = (req:Request,res:Response)=>{
    res.send("Login Route")
}
