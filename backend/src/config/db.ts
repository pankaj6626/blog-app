import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async () => {
  try {
    if (!env.MONOG_URI) {
      throw new Error("MONOG_URI is not defined");
    }

    await mongoose.connect(env.MONOG_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
