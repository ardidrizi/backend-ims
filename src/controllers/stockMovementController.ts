import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a new stock movement
export const createStockMovement = async (req: Request, res: Response) => {
  try {
    const { productId, quantityChanged, type } = req.body;
    const stockMovement = await prisma.stockMovement.create({
      data: {
        productId,
        quantityChanged,
        type,
      },
    });
    res.status(201).json(stockMovement);
  } catch (error) {
    // console.error("Error creating stock movement:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: (error as Error).message });
  }
};

// Get all stock movements
export const getStockMovements = async (req: Request, res: Response) => {
  try {
    console.log("Fetching stock movements");
    const stockMovements = await prisma.stockMovement.findMany();
    console.log("Stock movements fetched:", stockMovements);
    const validStockMovements = [];

    for (const movement of stockMovements) {
      const product = await prisma.product.findUnique({
        where: { id: movement.productId },
      });
      if (product) {
        validStockMovements.push(movement);
      } else {
        console.warn(`Invalid product ID: ${movement.productId}`);
      }
    }

    res.status(200).json(validStockMovements);
  } catch (error) {
    // console.error("Error fetching stock movements:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: (error as Error).message });
  }
};

// Get a single stock movement by ID
export const getStockMovementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stockMovement = await prisma.stockMovement.findUnique({
      where: { id: Number(id) },
    });
    // if (!stockMovement) {
    //   return res.status(404).json({ error: "Stock movement not found" });
    // }
    res.status(200).json(stockMovement);
  } catch (error) {
    // console.error("Error fetching stock movement:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: (error as Error).message });
  }
};

// Update a stock movement by ID
export const updateStockMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productId, quantityChanged, type } = req.body;
    const stockMovement = await prisma.stockMovement.update({
      where: { id: Number(id) },
      data: {
        productId,
        quantityChanged,
        type,
      },
    });
    res.status(200).json(stockMovement);
  } catch (error) {
    // console.error("Error updating stock movement:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: (error as Error).message });
  }
};

// Delete a stock movement by ID
export const deleteStockMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.stockMovement.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred", details: (error as Error).message });
  }
};
