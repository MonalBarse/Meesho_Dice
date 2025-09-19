import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend running 🚀" });
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
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ML Placeholder Endpoint
app.post("/certainty-score", async (req, res) => {
  try {
    const { productId, score } = req.body;
    const cs = await prisma.certaintyScore.create({
      data: { productId, score },
    });
    res.json(cs);
  } catch (err) {
    console.error("Error saving certainty score:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
