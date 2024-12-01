import express from "express";
import {
  getUser,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
  signupUser,
} from "../controllers/userController";

const router = express.Router();

// User CRUD routes
router.get("/users", getUser);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);

// Authentication routes
router.post("/login", loginUser);
router.post("/signup", signupUser);

export default router;
