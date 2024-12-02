import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { userId, items } = req.body; // Remove newField
  try {
    const order = await prisma.order.create({
      data: {
        userId,
        customerName: req.body.customerName, // Add customerName
        totalAmount: items.reduce(
          (acc: number, item: any) => acc + item.price * item.quantity,
          0
        ),
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        // Remove newField
        shippingAddress: req.body.shippingAddress,
        billingAddress: req.body.billingAddress,
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

const getOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  console.log(`Fetching order with id: ${id}`); // Add logging
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { orderItems: true }, // Ensure orderItems relationship is included
    });
    if (!order) {
      console.log(`Order with id ${id} not found`); // Add logging
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(`Error retrieving order with id ${id}:`, error); // Add logging
    res.status(500).json({ error: "Failed to retrieve order" });
  }
};

const getOrders = async (req: Request, res: Response): Promise<void> => {
  console.log("Fetching all orders"); // Add logging
  try {
    const orders = await prisma.order.findMany({
      include: { orderItems: true }, // Ensure orderItems relationship is included
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error); // Add logging
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
};

export { createOrder, getOrder, getOrders };
