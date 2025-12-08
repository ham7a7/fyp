import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from 'express';
import session from "express-session";
import passport from "passport";
import { connectToDb } from "./database/db.js";
import "./passport.js";
import appRouter from './routes/index.js';

config();

const app = express();
const PORT =  process.env.PORT;
const ONE_DAY: number = 1000 * 60 * 60 * 24;
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET!,
  saveUninitialized:false,
  resave:false,
  cookie:{  
    maxAge:ONE_DAY // 1 day,
  },
  store:MongoStore.create({
  // client: mongoose.connection.getClient(),
  mongoUrl:process.env.MONGODB_CONNECTION_URI!,
  collectionName:"sessions",

  })
}))
app.use(passport.initialize())
app.use(passport.session())




app.use("/",appRouter);


connectToDb() 
  .then(() => app.listen(PORT, () =>  (`listening on port ${PORT}`)))
  .catch((error) => console.error(error.message));
