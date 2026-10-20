import mongoose from "mongoose";

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

// Without a listener, a connection error after startup would crash the server
mongoose.connection.on("error", (error) =>
  console.error("MongoDB connection error:", error.message)
);

// Connect to MongoDB, retrying a few times before giving up

const connectToDb = async (): Promise<void> => {
  for (let attempt = 1; ; attempt++) {
    try {
      await mongoose.connect(process.env.MONGODB_CONNECTION_URI!, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("Connected to MongoDB");
      return;
    } catch (error: any) {
      console.error(
        `Error connecting to MongoDB (attempt ${attempt} of ${MAX_ATTEMPTS}):`,
        error.message
      );
      await mongoose.disconnect().catch(() => {});
      if (attempt === MAX_ATTEMPTS) throw error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};

const disconnectFromDb = async ():Promise<void> =>
  await mongoose.disconnect().catch((error) =>
    console.error("Error couldn't disconnect from MongoDB:", error)
  );


export { connectToDb, disconnectFromDb, mongoose };
