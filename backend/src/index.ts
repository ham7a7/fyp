import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { connectToDb, mongoose } from "./database/db.js";
import "./passport.js";
import appRouter from "./routes/index.js";
import { ensureVectorIndex } from "./utils/ragUtils.js";

// Now you can use __dirname as you would in a CommonJS module

config();

const app = express();
const PORT = process.env.PORT;
const ONE_DAY: number = 1000 * 60 * 60 * 24;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  express.json({
    // Keep the raw body, WhatsApp webhook signatures are calculated from it
    verify: (req, _res, buf) => {
      (req as express.Request).rawBody = buf;
    },
  }),
);
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

// The server only starts once the database is connected
const startServer = async () => {
  await connectToDb();

  // TTL index that deletes expired sessions. A failure here isn't fatal, it's retried on the next start
  await mongoose.connection
    .collection("sessions")
    .createIndex({ expires: 1 }, { background: true, expireAfterSeconds: 0 })
    .catch((error) =>
      console.error("Couldn't create the sessions expiry index:", error.message),
    );
  await ensureVectorIndex().catch((error) =>
    console.error("Couldn't check the vector search index:", error.message),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: ONE_DAY, // 1 day,
      },
      store: MongoStore.create({
        // Reuse the Mongoose connection instead of opening a second one
        client: mongoose.connection.getClient(),
        collectionName: "sessions",
        // The expiry index is created above: if connect-mongo's own attempt fails,
        // the error is unhandled and crashes the server
        autoRemove: "disabled",
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/", appRouter);

  // Log requests that don't match any route, e.g. a webhook URL saved with the wrong path
  app.use((req: express.Request, res: express.Response) => {
    const hint = req.originalUrl.includes("webhook")
      ? " (if this is Meta, the Callback URL in Meta is wrong: copy it from the bot's WhatsApp card)"
      : "";
    console.warn(`404 Not found: ${req.method} ${req.originalUrl}${hint}`);
    res.status(404).json({ message: "Not found" });
  });

  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
};

startServer().catch((error) => {
  console.error("Server not started, could not connect to MongoDB:", error.message);
  process.exit(1);
});
