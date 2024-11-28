import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController";

const supplierRouter = express.Router();

supplierRouter.get("/suppliers", getSuppliers);
supplierRouter.post("/suppliers", createSupplier);
supplierRouter.get("/suppliers/:id", getSupplierById);
supplierRouter.put("/suppliers/:id", updateSupplier);
supplierRouter.delete("/suppliers/:id", deleteSupplier);

export default supplierRouter;
