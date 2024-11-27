import express, { Request, Response } from "express";
import dotenv from "dotenv";

// Initialize dotenv for environment variables
dotenv.config();

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is up and running!");
});

// Import routes
import productRoutes from "./routes/productRoutes";
productRoutes.use("/api", productRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
