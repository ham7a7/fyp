import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from 'express';
import { connectToDb } from "./database/db.js";
import appRouter from './routes/index.js';

config();

const app = express();
const PORT =  process.env.PORT;

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api",appRouter);

connectToDb()
  .then(() => app.listen(PORT, () =>  (`listening on port ${PORT}`)))
  .catch((error) => console.error(error.message));
