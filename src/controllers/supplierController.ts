import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all suppliers
export const getSuppliers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        products: true,
      },
    });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Create a new supplier
export const createSupplier = async (req: Request, res: Response) => {
  // check if supplier already exists

  try {
    const { name, contactInfo, email, phone, address, products } = req.body;
    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactInfo,
        email,
        phone,
        address,
        products: {
          connect: products.map((productId: number) => ({ id: productId })),
        },
      },
    });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Get a single supplier by ID
export const getSupplierById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        products: true,
      },
    });
    res.status(200).json(supplier);
  } catch (error) {
    next(error);
  }
};

// Update a supplier by ID
export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await prisma.supplier.update({
      where: { id: Number(req.params.id) },
      data: {
        name: req.body.name,
        contactInfo: req.body.contactInfo,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
      },
    });
    res.status(200).json(supplier);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Delete a supplier by ID
export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await prisma.supplier.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json({ message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
