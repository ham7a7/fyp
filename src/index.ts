import { config } from "dotenv";
import express from 'express';
import appRouter from './routes/index.js';
import { connectToDb } from "./utils/db.js";

config();

const app = express();
const PORT =  process.env.PORT;

app.use(express.json());

app.use("/api",appRouter);

connectToDb()
  .then(() => app.listen(PORT, () =>  (`listening on port ${PORT}`)))
  .catch((error) => console.error(error.message));
