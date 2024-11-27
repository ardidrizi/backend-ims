import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
} from "../controllers/productController";

const productRouter = express.Router();

productRouter.post("/products", addProduct);
productRouter.get("/products", getAllProducts);
productRouter.get("/:id", getProductById);
// router.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
