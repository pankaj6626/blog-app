import { authService } from "./auth.service.js";
export const register = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "User photo is required" });
        }
        const photo = req.files.photo;
        const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedFormats.includes(photo.mimetype)) {
            return res.status(400).json({
                message: "Invalid photo format. Only jpg and png are allowed",
            });
        }
        const result = await authService.register(req.body, {
            public_id: `user-${Date.now()}`,
            url: photo.tempFilePath,
        }, res);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Internal Server error" });
    }
};
export const login = async (req, res) => {
    try {
        const result = await authService.login(req.body, res);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Internal Server error" });
    }
};
export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", { path: "/" });
        return res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server error" });
    }
};
export const getMyProfile = async (req, res) => {
    return res.status(200).json({ user: req.user });
};
export const getAdmins = async (req, res) => {
    const { User } = await import("../user/user.schema.js");
    const admins = await User.find({ role: "admin" });
    return res.status(200).json({ admins });
};
