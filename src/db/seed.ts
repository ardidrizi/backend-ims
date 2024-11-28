// ...existing code...

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seedSuppliers() {
  const suppliers = [
    {
      id: 1,
      name: "Supplier 1",
      contactInfo: "Contact 1",
      email: "supplier1@example.com",
      phone: "123-456-7890",
      address: "Address 1",
    },
    {
      id: 2,
      name: "Supplier 2",
      contactInfo: "Contact 2",
      email: "supplier2@example.com",
      phone: "098-765-4321",
      address: "Address 2",
    },
  ];

  for (const supplier of suppliers) {
    try {
      await db.supplier.create({ data: supplier });
    } catch (error) {
      console.error(`Error creating supplier ${supplier.name}:`, error);
    }
  }
}

async function seedProducts() {
  const products = [
    {
      name: "Product 1",
      sku: "SKU001",
      category: "Category 1",
      price: 10.99,
      quantity: 100,
      supplierId: 1,
    },
    {
      name: "Product 2",
      sku: "SKU002",
      category: "Category 2",
      price: 15.99,
      quantity: 200,
      supplierId: 2,
    },
    {
      name: "Product 3",
      sku: "SKU003",
      category: "Category 3",
      price: 7.99,
      quantity: 150,
      supplierId: 1,
    },
  ];

  for (const product of products) {
    try {
      await db.product.create({ data: product });
    } catch (error) {
      console.error(`Error creating product ${product.name}:`, error);
    }
  }
}

// ...existing code...

async function main() {
  // ...existing code...
  await seedSuppliers();
  await seedProducts();
  // ...existing code...
}

// ...existing code...
main();
