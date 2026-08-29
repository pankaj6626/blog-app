import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || 4000),
  MONOG_URI: process.env.MONOG_URI || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "secretkey",
  CLOUD_NAME: process.env.CLOUD_NAME || "",
  CLOUD_API_KEY: process.env.CLOUD_API_KEY || "",
  CLOUD_SECRET_KEY: process.env.CLOUD_SECRET_KEY || "",
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};
