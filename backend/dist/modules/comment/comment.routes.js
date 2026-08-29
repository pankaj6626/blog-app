import { Router } from "express";
export const commentRoutes = Router();
commentRoutes.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
});
