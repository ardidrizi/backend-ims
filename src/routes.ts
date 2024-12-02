import { Router } from "express";
import { adminProtectedRoute } from "./controllers/userController";
import { checkAdmin } from "./middlewares/checkAdmin";
import {
  createOrder,
  getOrder,
  getOrders,
} from "./controllers/orderController";

const router = Router();

// ...existing code...

router.get("/admin-protected-route", checkAdmin, adminProtectedRoute);

router.get("/orders", getOrders);

export default router;
