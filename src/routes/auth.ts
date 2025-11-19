import { Router } from "express";
import { loginHandler } from '../handlers/auth.js';


const auth:Router = Router();

auth.get("/login",loginHandler);

export default auth;