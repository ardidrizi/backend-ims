import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.create({
      data: req.body,
    });
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a category by ID
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a category by ID
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};
