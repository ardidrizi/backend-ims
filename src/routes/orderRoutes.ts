import express from "express";
import {
  createOrder,
  getOrder,
  getOrders,
} from "../controllers/orderController";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders/:id", getOrder);
router.get("/orders", getOrders);

export default router;
