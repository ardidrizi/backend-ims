import express, { Request, Response } from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRouter from "./routes/productRoutes";
import supplierRouter from "./routes/supplierRoutes";
import stockMovementRouter from "./routes/stockMovementRoutes";

// Initialize dotenv for environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(logger("dev"));
// origin local host

// Middleware for parsing JSON
app.use(express.json());

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is up and running!");
});

app.use("/api", stockMovementRouter);
app.use("/api", supplierRouter);
app.use("/api", productRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
