import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.log("Redis client error:", err.message);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.log("Redis is not available, continuing without cache:", error.message);
  }
};

export const getRedisClient = () => redisClient;

export const getCachedData = async (key) => {
  try {
    if (!redisClient.isOpen) return null;
    const cachedValue = await redisClient.get(key);
    return cachedValue ? JSON.parse(cachedValue) : null;
  } catch (error) {
    console.log("Redis GET error:", error.message);
    return null;
  }
};

export const setCachedData = async (key, value, ttlInSeconds = 300) => {
  try {
    if (!redisClient.isOpen) return;
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlInSeconds,
    });
  } catch (error) {
    console.log("Redis SET error:", error.message);
  }
};

export const invalidateBlogCache = async (id = null) => {
  try {
    if (!redisClient.isOpen) return;

    const keys = await redisClient.keys("blogs:*");
    if (keys.length === 0) return;

    if (id) {
      await redisClient.del(`blogs:all`, `blogs:single:${id}`);
      return;
    }

    await redisClient.del(keys);
  } catch (error) {
    console.log("Redis invalidation error:", error.message);
  }
};
