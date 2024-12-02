import express from "express";
import {
  loginUser,
  signupUser,
  createUser,
  getUser,
  getUserById,
  updateUserById,
  deleteUserById,
  adminProtectedRoute,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

// User CRUD routes
router.get("/users", getUser);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);

// Handle 404 for POST /users
router.post("/users/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

// Authentication routes
router.post("/login", loginUser);
router.post("/signup", signupUser);

// Handle 404 for POST /login and /signup
router.post("/login/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});
router.post("/signup/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

router.get("/admin", authMiddleware, adminProtectedRoute);

export default router;
