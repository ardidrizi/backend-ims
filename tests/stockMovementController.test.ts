import {
  createStockMovement,
  getStockMovements,
  getStockMovementById,
  updateStockMovement,
  deleteStockMovement,
} from "../src/controllers/stockMovementController";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    stockMovement: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("Stock Movement Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let status: jest.Mock;
  let json: jest.Mock;
  let send: jest.Mock; // Added mock for send
  let prismaMock: any;

  beforeEach(() => {
    status = jest.fn().mockReturnThis();
    json = jest.fn();
    send = jest.fn(); // Initialize send mock
    res = { status, json, send }; // Include send in the res mock
    prismaMock = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createStockMovement - success", async () => {
    req = { body: { productId: 1, quantityChanged: 10, type: "IN" } };
    const mockStockMovement = {
      id: 1,
      productId: 1,
      quantityChanged: 10,
      type: "IN",
    };
    prismaMock.stockMovement.create.mockResolvedValue(mockStockMovement);

    await createStockMovement(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(mockStockMovement);
  });

  test("getStockMovements - success", async () => {
    req = {};
    const mockStockMovements = [
      { id: 1, productId: 1, quantityChanged: 10, type: "IN" },
      { id: 2, productId: 2, quantityChanged: -5, type: "OUT" },
    ];

    const mockProduct1 = { id: 1, name: "Product 1" }; // Mock product for stock movement 1
    const mockProduct2 = { id: 2, name: "Product 2" }; // Mock product for stock movement 2

    // Mock the Prisma methods
    prismaMock.stockMovement.findMany.mockResolvedValue(mockStockMovements);
    prismaMock.product.findUnique
      .mockResolvedValueOnce(mockProduct1) // First call returns mockProduct1
      .mockResolvedValueOnce(mockProduct2); // Second call returns mockProduct2

    // Run the controller function
    await getStockMovements(req as Request, res as Response);

    // Check if the response has the correct status and data
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(mockStockMovements); // Expect the original stock movements since both products are valid
  });

  test("getStockMovements - failure", async () => {
    const errorMessage = "Error fetching stock movements";
    prismaMock.stockMovement.findMany.mockRejectedValue(
      new Error(errorMessage)
    );

    await getStockMovements(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: "An error occurred",
      details: errorMessage,
    });
  });

  test("getStockMovementById - success", async () => {
    req = { params: { id: "1" } };
    const mockStockMovement = {
      id: 1,
      productId: 1,
      quantityChanged: 10,
      type: "IN",
    };
    prismaMock.stockMovement.findUnique.mockResolvedValue(mockStockMovement);

    await getStockMovementById(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(mockStockMovement);
  });

  test("updateStockMovement - success", async () => {
    req = { params: { id: "1" }, body: { quantityChanged: 15 } };
    const mockUpdatedStockMovement = {
      id: 1,
      productId: 1,
      quantityChanged: 15,
      type: "IN",
    };
    prismaMock.stockMovement.update.mockResolvedValue(mockUpdatedStockMovement);

    await updateStockMovement(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(mockUpdatedStockMovement);
  });

  test("deleteStockMovement - success", async () => {
    req = { params: { id: "1" } };
    prismaMock.stockMovement.delete.mockResolvedValue({});

    await deleteStockMovement(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(204);
    expect(send).toHaveBeenCalled(); // Ensure send is called for successful delete
  });

  test("deleteStockMovement - failure", async () => {
    req = { params: { id: "1" } };
    const errorMessage = "Error deleting stock movement";
    prismaMock.stockMovement.delete.mockRejectedValue(new Error(errorMessage));

    await deleteStockMovement(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: "An error occurred",
      details: errorMessage,
    });
  });

  // Add more tests for other controller functions...
});
