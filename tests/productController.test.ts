import request from "supertest";
import { app } from "../src/app"; // Assuming you have an Express app instance
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let server: any;

beforeAll(async () => {
  if (!server) {
    server = app.listen(5000);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
  if (server) {
    server.close();
  }
});

describe("Product Controller", () => {
  describe("GET /products", () => {
    it("should fetch all products", async () => {
      const res = await request(app).get("/products");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /products", () => {
    it("should add a new product", async () => {
      const newProduct = {
        name: "Test Product",
        price: 100,
        supplierId: 1,
        categoryId: 1,
        sku: `TESTSKU-${Date.now()}`, // Ensure unique SKU
      };
      const res = await request(app).post("/products").send(newProduct);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe(newProduct.name);
    });
  });

  describe("GET /products/:id", () => {
    it("should fetch a product by ID", async () => {
      const product = await prisma.product.create({
        data: {
          name: "Test Product",
          price: 100,
          supplierId: 1,
          categoryId: 1,
          sku: `TESTSKU-${Date.now()}`, // Ensure unique SKU
          expiration: new Date("2023-12-31"),
          quantity: 10,
        },
      });
      const res = await request(app).get(`/products/${product.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", product.id);
    });
  });

  describe("PUT /products/:id", () => {
    it("should update a product by ID", async () => {
      const product = await prisma.product.create({
        data: {
          name: "Test Product",
          price: 100,
          supplierId: 1,
          categoryId: 1,
          sku: `TESTSKU-${Date.now()}`, // Ensure unique SKU
          expiration: new Date("2023-12-31"),
          quantity: 10,
        },
      });
      const updatedProduct = {
        name: "Updated Product",
        price: 150,
        supplierId: 1,
        categoryId: 1,
      };
      const res = await request(app)
        .put(`/products/${product.id}`)
        .send(updatedProduct);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updatedProduct.name);
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete a product by ID", async () => {
      const product = await prisma.product.create({
        data: {
          name: "Test Product",
          price: 100,
          supplierId: 1,
          categoryId: 1,
          sku: `TESTSKU-${Date.now()}`, // Ensure unique SKU
          expiration: new Date("2023-12-31"),
          quantity: 10,
        },
      });
      const res = await request(app).delete(`/products/${product.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
    });
  });
});
