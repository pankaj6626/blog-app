import { Router } from "express";
import { register, login, logout, getMyProfile, getAdmins } from "./auth.controller.js";
import { isAuthenticated, isAdmin } from "../../middleware/auth.middleware.js";
export const authRoutes = Router();
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/logout", logout);
authRoutes.get("/my-profile", isAuthenticated, getMyProfile);
authRoutes.get("/admins", isAuthenticated, isAdmin("admin"), getAdmins);
