import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";

// Instantiate Prisma client
const prisma = new PrismaClient();

// Interface to define the body for adding a product
interface AddProductRequestBody {
  name: string;
  price: number;
  supplierId: number;
}

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, pageSize = 10 } = req.query; // Get page and pageSize from query parameters (defaults to 1 and 10)
    const products = await prisma.product.findMany({
      skip: (Number(page) - 1) * Number(pageSize), // Skip records for pagination
      take: Number(pageSize), // Limit the number of records returned
    });

    res.json(products);
  } catch (error: unknown) {
    handleError(error, res, "Error fetching products");
  }
};

export const addProduct = async (
  req: Request<{}, {}, AddProductRequestBody>, // Using a body type for explicit structure
  res: Response
): Promise<void> => {
  const { name, price, supplierId } = req.body;

  // Validate the input fields
  if (!name || !price || !supplierId) {
    res.status(400).json({ error: "Name, price, and supplierId are required" });
    return;
  }

  if (isNaN(price) || price <= 0) {
    res.status(400).json({ error: "Price must be a positive number" });
    return;
  }

  try {
    // Create the product in the database
    const product = await prisma.product.create({
      data: {
        name,
        price,
        sku: "default-sku", // You can generate this dynamically if needed
        category: "default-category", // Default category if not provided
        quantity: 0, // Default quantity
        supplierId,
      },
    });

    // Return the created product as the response
    res.status(201).json(product);
  } catch (error: unknown) {
    handleError(error, res, "Error adding product");
  }
};

export const getProductById = async (
  req: Request<{ id: string }>, // Type the ID param as a string
  res: Response
): Promise<void> => {
  const { id } = req.params; // Get the product ID from the request parameters
  const productId = parseInt(id);

  if (isNaN(productId)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  try {
    // Query the database to find the product by ID
    const product = await prisma.product.findUnique({
      where: { id: productId }, // Ensure the id is parsed as an integer
    });

    // If the product is not found, send a 404 error
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // If the product is found, send it as the response
    res.json(product);
  } catch (error: unknown) {
    handleError(error, res, "Error fetching product by ID");
  }
};

export const deleteProduct = async (
  req: Request<{ id: string }>, // Type the ID param as a string
  res: Response
): Promise<void> => {
  const { id } = req.params; // Get the product ID from the request parameters
  const productId = parseInt(id);

  if (isNaN(productId)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  try {
    // Delete the product from the database
    const product = await prisma.product.delete({
      where: { id: productId }, // Ensure the id is parsed as an integer
    });

    // If the product was deleted, send a success message
    res.json({ message: `Product with id ${id} has been deleted`, product });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // Prisma error code for not found record
      res.status(404).json({ error: "Product not found" });
      return;
    }
    handleError(error, res, "Error deleting product");
  }
};

// Utility function to handle error logging
function handleError(
  error: unknown,
  res: Response,
  customMessage: string
): void {
  if (error instanceof Error) {
    // Error is an instance of the built-in Error object
    console.error(`${customMessage}:`, error.stack || error.message);
  } else {
    // For unknown error types
    console.error(customMessage, error);
  }

  res.status(500).json({ error: customMessage });
}