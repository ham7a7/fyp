import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { connectToDb } from "./database/db.js";
import "./passport.js";
import appRouter from "./routes/index.js";

// Now you can use __dirname as you would in a CommonJS module

config();

const app = express();
const PORT = process.env.PORT;
const ONE_DAY: number = 1000 * 60 * 60 * 24;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// CORS configuration
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or Postman
      if (!origin) return callback(null, true);

      // Allow ALL origins for widget
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-API-Key", "Authorization"],
  }),
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: ONE_DAY, // 1 day,
    },
    store: MongoStore.create({
      // client: mongoose.connection.getClient(),
      mongoUrl: process.env.MONGODB_CONNECTION_URI!,
      collectionName: "sessions",
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", appRouter);

connectToDb()
  .then(() => app.listen(PORT, () => console.log(`listening on port ${PORT}`)))
  .catch((error) => console.error(error.message));
