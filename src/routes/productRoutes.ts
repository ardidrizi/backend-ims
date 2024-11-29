import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController";

const productRouter = express.Router();

productRouter.post("/products", addProduct);
productRouter.get("/products", getAllProducts);
productRouter.get("/products/:id", getProductById);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
