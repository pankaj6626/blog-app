import { Redis } from "@upstash/redis";
import { env } from "./env.js";
const redisClient = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;
export const connectRedis = async () => {
    if (!redisClient) {
        console.log("Redis not configured. Cache disabled.");
        return;
    }
    try {
        await redisClient.ping();
        console.log("Redis connected successfully");
    }
    catch (error) {
        console.log("Redis is not available, continuing without cache:", error?.message);
    }
};
export const getRedisClient = () => redisClient;
export const getCachedData = async (key) => {
    try {
        if (!redisClient)
            return null;
        const cachedValue = await redisClient.get(key);
        return cachedValue ? JSON.parse(String(cachedValue)) : null;
    }
    catch (error) {
        console.log("Redis GET error:", error?.message);
        return null;
    }
};
export const setCachedData = async (key, value, ttlInSeconds = 300) => {
    try {
        if (!redisClient)
            return;
        await redisClient.set(key, JSON.stringify(value), {
            ex: ttlInSeconds,
        });
    }
    catch (error) {
        console.log("Redis SET error:", error?.message);
    }
};
export const invalidateBlogCache = async (id) => {
    try {
        if (!redisClient)
            return;
        const keys = await redisClient.keys("blogs:*");
        if (!keys || keys.length === 0)
            return;
        if (id) {
            await redisClient.del(`blogs:all`, `blogs:single:${id}`);
            return;
        }
        await redisClient.del(...keys);
    }
    catch (error) {
        console.log("Redis invalidation error:", error?.message);
    }
};
