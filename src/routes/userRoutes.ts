import express from "express";
import {
  loginUser,
  signupUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

// User CRUD routes
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Authentication routes
router.post("/login", loginUser);
router.post("/signup", signupUser);

export default router;
