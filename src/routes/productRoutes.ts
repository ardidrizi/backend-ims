import { Router } from "express";
import {
  getAllProducts,
  addProduct,
  getProductById,
  deleteProduct,
} from "../controllers/productController";

const productRoutes = Router();

// get all products
productRoutes.get("/products", getAllProducts);

// post a product
productRoutes.post("/products", addProduct);

// get a product by id
productRoutes.get("/products/:id", getProductById);

// delete a product by id
productRoutes.delete("/products/:id", deleteProduct);

export default productRoutes;
