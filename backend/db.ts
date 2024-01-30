import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URL: string = "mongodb://localhost:27017";

export const dbConnect = async () => {
  try {
    await mongoose.connect(URL);
    console.log("DB connected successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while connecting to the database:", error.message);
    }
  }
};
