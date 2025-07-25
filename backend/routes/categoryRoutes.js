import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../controllers/category.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const categoryRouter = express.Router();

// Protected route to create a category
categoryRouter.post("/create", verifyToken, createCategory);
categoryRouter.get("/get-categories", verifyToken, getCategories);
categoryRouter.get(
  "/get-categories-by-id/:categoryId",
  verifyToken,
  getCategoryById
);
categoryRouter.put(
  "/update-categories/:categoryId",
  verifyToken,
  updateCategory
);
categoryRouter.delete(
  "/delete-categories/:categoryId",
  verifyToken,
  deleteCategory
);

// Add more category routes here (e.g., get all, update, delete, etc.)

export default categoryRouter;
