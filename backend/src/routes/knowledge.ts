import { config } from "dotenv";
import { Router } from "express";
import { save } from "../handlers/knowledge.js";
import { handleUpload } from "../middlewares/handleUpload.js";
config();

const knowledge: Router = Router();

const size = 10 * 1024 * 1024; // 10MB limit

knowledge.post("/save", handleUpload("document", size), save);

export default knowledge;
