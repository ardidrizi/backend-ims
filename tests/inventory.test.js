const request = require("supertest");
const app = require("../app"); // Adjust the path as necessary

describe("Inventory Management API", () => {
  it("should get all inventory items", async () => {
    const res = await request(app).get("/api/inventory");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("items");
  });

  it("should create a new inventory item", async () => {
    const newItem = {
      name: "New Item",
      quantity: 10,
      price: 100,
    };
    const res = await request(app).post("/api/inventory").send(newItem);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should update an inventory item", async () => {
    const updateItem = {
      name: "Updated Item",
      quantity: 20,
      price: 200,
    };
    const res = await request(app).put("/api/inventory/1").send(updateItem);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Updated Item");
  });

  it("should delete an inventory item", async () => {
    const res = await request(app).delete("/api/inventory/1");
    expect(res.statusCode).toEqual(204);
  });
});
