import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const categoryRouter = express.Router();

// ...existing code...

// Route to get all categories
categoryRouter.get("/categories", getCategories);

// Route to create a new category
categoryRouter.post("/categories", createCategory);

// Route to update an existing category
categoryRouter.put("/categories/:id", updateCategory);

// Route to get a single category by ID
categoryRouter.get("/categories/:id", getCategoryById);

// Route to delete a category
categoryRouter.delete("/categories/:id", deleteCategory);

// ...existing code...

export default categoryRouter;
