import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all users
export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.send(users);
  } catch (error) {
    res.status(500).send;
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });
    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a user by ID
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a user by ID
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};
