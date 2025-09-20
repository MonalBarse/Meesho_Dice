import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "Backend running 🚀" }));

// Users CRUD
app.post("/users", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({ data: { email, name } });
    res.json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Products CRUD
app.post("/products", async (req, res) => {
  try {
    const { name, category } = req.body;
    const product = await prisma.product.create({ data: { name, category } });
    res.json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Add User Measurements
app.post("/user-measurements", async (req, res) => {
  try {
    const { userId, height, bust, waist, hip, inseam } = req.body;
    const measurement = await prisma.userMeasurement.create({
      data: { userId, height, bust, waist, hip, inseam },
    });
    res.json(measurement);
  } catch (err) {
    console.error("Error saving user measurement:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add Product Measurements
app.post("/product-measurements", async (req, res) => {
  try {
    const { productId, bust, waist, hip, length } = req.body;
    const measurement = await prisma.productMeasurement.create({
      data: { productId, bust, waist, hip, length },
    });
    res.json(measurement);
  } catch (err) {
    console.error("Error saving product measurement:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ML Certainty Score placeholder
app.post("/certainty-score", async (req, res) => {
  try {
    const { productId, score } = req.body;
    const cs = await prisma.certaintyScore.create({ data: { productId, score } });
    res.json(cs);
  } catch (err) {
    console.error("Error creating certainty score:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
