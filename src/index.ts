import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const PORT = 5000;

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
if (!mongoConnectionString) {
  throw new Error("MONGO_CONNECTION_STRING is not defined");
}

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
