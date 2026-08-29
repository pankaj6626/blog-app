import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.schema.js";
import { env } from "../config/env.js";
export const isAuthenticated = async (req, res, next) => {
    try {
        const tokenFromCookie = req.cookies?.jwt;
        const authHeader = req.headers.authorization;
        const token = tokenFromCookie ||
            (authHeader && authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null);
        if (!token) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const decoded = jwt.verify(token, env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        console.log("Error occuring in Authentication: " + error);
        return res.status(401).json({ error: "User not authenticated" });
    }
};
export const isAdmin = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `User with given role ${req.user?.role || "unknown"} not allowed`,
            });
        }
        return next();
    };
};
