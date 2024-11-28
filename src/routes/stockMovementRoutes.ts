import { Router } from "express";
import {
  createStockMovement,
  getStockMovements,
  getStockMovementById,
  updateStockMovement,
  deleteStockMovement,
} from "../controllers/stockMovementController";

const router = Router();

router.get("/stock-movements", getStockMovements);
router.post("/stock-movements", createStockMovement);
router.get("/stock-movements/:id", getStockMovementById);
router.put("/stock-movements/:id", updateStockMovement);
router.delete("/stock-movements/:id", deleteStockMovement);

export default router;
