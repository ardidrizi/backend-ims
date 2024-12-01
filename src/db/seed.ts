import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if Category I exists, if not, create it
  const categoryI = await prisma.category.findFirst({
    where: { name: "Category I" },
  });

  // If it doesn't exist, create Category I
  if (!categoryI) {
    await prisma.category.create({
      data: {
        name: "Category I",
      },
    });
  }

  // Check if Category II exists, if not, create it
  const categoryII = await prisma.category.findFirst({
    where: { name: "Category II" },
  });

  // If it doesn't exist, create Category II
  if (!categoryII) {
    await prisma.category.create({
      data: {
        name: "Category II",
      },
    });
  }

  // Ensure supplier with id 1 exists
  const supplier = await prisma.supplier.findFirst({
    where: { id: 1 },
  });

  if (!supplier) {
    await prisma.supplier.create({
      data: {
        id: 1,
        name: "Default Supplier",
        email: "default@supplier.com",
        phone: "123-456-7890",
        address: "123 Default St, Default City, DC 12345",
        contactInfo: "Contact Info",
      },
    });
  }

  // Get the categories we just created/found (needed for later product creation)
  const category1 = await prisma.category.findFirst({
    where: { name: "Category I" },
  });
  const category2 = await prisma.category.findFirst({
    where: { name: "Category II" },
  });

  // Add Products (assuming you have a supplier with id 1 already)
  if (!category1) {
    throw new Error("Category I not found");
  }
  if (!category2) {
    throw new Error("Category II not found");
  }
  const products = [
    {
      name: "Lemon",
      sku: "SKU_LEMON",
      expiration: new Date("2024-12-31"),
      price: 0.99,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Orange",
      sku: "SKU_ORANGE",
      expiration: new Date("2024-12-31"),
      price: 1.49,
      categoryId: category2.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Apple",
      sku: "SKU_APPLE",
      expiration: new Date("2024-12-31"),
      price: 1.29,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Pear",
      sku: "SKU_PEAR",
      expiration: new Date("2024-12-31"),
      price: 1.39,
      categoryId: category2.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Grape",
      sku: "SKU_GRAPE",
      expiration: new Date("2024-12-31"),
      price: 2.99,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Blueberry",
      sku: "SKU_BLUEBERRY",
      expiration: new Date("2024-12-31"),
      price: 3.49,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Pineapple",
      sku: "SKU_PINEAPPLE",
      expiration: new Date("2024-12-31"),
      price: 2.79,
      categoryId: category2.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Watermelon",
      sku: "SKU_WATERMELON",
      expiration: new Date("2024-12-31"),
      price: 3.99,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Strawberry",
      sku: "SKU_STRAWBERRY",
      expiration: new Date("2024-12-31"),
      price: 4.49,
      categoryId: category2.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Peach",
      sku: "SKU_PEACH",
      expiration: new Date("2024-12-31"),
      price: 2.29,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Plum",
      sku: "SKU_PLUM",
      expiration: new Date("2024-12-31"),
      price: 1.89,
      categoryId: category2.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Cherry",
      sku: "SKU_CHERRY",
      expiration: new Date("2024-12-31"),
      price: 5.49,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Kiwi",
      sku: "SKU_KIWI",
      expiration: new Date("2024-12-31"),
      price: 1.99,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Banana",
      sku: "SKU_BANANA",
      expiration: new Date("2024-12-31"),
      price: 0.89,
      categoryId: category2.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Mango",
      sku: "SKU_MANGO",
      expiration: new Date("2024-12-31"),
      price: 2.49,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Papaya",
      sku: "SKU_PAPAYA",
      expiration: new Date("2024-12-31"),
      price: 3.29,
      categoryId: category2.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Raspberry",
      sku: "SKU_RASPBERRY",
      expiration: new Date("2024-12-31"),
      price: 4.29,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Pomegranate",
      sku: "SKU_POMEGRANATE",
      expiration: new Date("2024-12-31"),
      price: 2.89,
      categoryId: category2.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Coconut",
      sku: "SKU_COCONUT",
      expiration: new Date("2024-12-31"),
      price: 3.49,
      categoryId: category1.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
    {
      name: "Fig",
      sku: "SKU_FIG",
      expiration: new Date("2024-12-31"),
      price: 2.19,
      categoryId: category2.id,
      supplierId: 1, // Assuming supplierId 1 exists
    },
  ];

  // Insert Products into the database
  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { sku: product.sku },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          name: product.name,
          sku: product.sku,
          expiration: product.expiration,
          price: product.price,
          categoryId: product.categoryId,
          supplierId: product.supplierId,
          quantity: 100, // Set an initial quantity of 100 for each product
        },
      });
    }
  }

  console.log("Seed data has been inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
