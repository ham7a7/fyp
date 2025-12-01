import { Router, type Request, type Response } from "express";
import auth from "./auth.js";

const appRouter:Router = Router();
appRouter.use("/api/auth",auth);
// appRouter.use("/api/users",auth);
// appRouter.use("/api/intents",auth);
appRouter.get("/",(req:Request,res:Response)=>{
    console.log("is Auth:", req.isAuthenticated());
    console.log("User:", req.user);
    console.log("Session:", req.session );
    console.log("Session ID:", req.sessionID );
    if(!req.isAuthenticated() || !req.user){
        return res.send("Not LoggedIn."); 
    }
    return res.send(`API is working. Logged in as ${req.user}`);
     
});

export default appRouter;