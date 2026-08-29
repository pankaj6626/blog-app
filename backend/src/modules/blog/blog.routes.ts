import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  addComment,
  deleteComment,
} from "./blog.controller.js";
import { isAuthenticated, isAdmin } from "../../middleware/auth.middleware.js";

export const blogRoutes = Router();

blogRoutes.get("/all-blogs", getAllBlogs);
blogRoutes.get("/my-blog", isAuthenticated, getMyBlogs);
blogRoutes.get("/single-blog/:id", getSingleBlog);
blogRoutes.post("/create", isAuthenticated, isAdmin("admin"), createBlog);
blogRoutes.put("/update/:id", isAuthenticated, isAdmin("admin"), updateBlog);
blogRoutes.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBlog);
blogRoutes.post("/:id/comments", isAuthenticated, addComment);
blogRoutes.delete("/:id/comments/:commentId", isAuthenticated, deleteComment);
