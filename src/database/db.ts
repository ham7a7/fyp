import { connect, disconnect } from "mongoose";

// Connect to MongoDB

const connectToDb =async ():Promise<void> =>
  await connect(process.env.MONGODB_CONNECTION_URI!)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => console.error("Error connecting to MongoDB:", error));

const disconnectFromDb = async ():Promise<void> =>
  await disconnect().catch((error) =>
    console.error("Error couldn't disconnect from MongoDB:", error)
  );

export { connectToDb, disconnectFromDb };

