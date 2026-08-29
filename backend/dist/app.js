import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connectDatabase } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { env } from "./config/env.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { blogRoutes } from "./modules/blog/blog.routes.js";
const app = express();
const origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "https://blog-app-9ifo.onrender.com",
    "https://blog-app-9ifo.onrender.com/",
    "https://blog-app-9ifo.onrender.com/api",
    "https://*.vercel.app",
    env.FRONTEND_URL,
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
app.use("/api/users", authRoutes);
app.use("/api/blogs", blogRoutes);
app.get("/", (_req, res) => {
    res.json({ message: "Blog app backend is running" });
});
const startServer = async () => {
    await connectDatabase();
    await connectRedis();
    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
};
startServer();
export default app;
