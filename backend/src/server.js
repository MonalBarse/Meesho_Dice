const express = require('express');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const ML_API_URL = "http://127.0.0.1:8000/predict";

// ===========================================
// USER ENDPOINTS
// ===========================================

// Create User
app.post('/api/users', async (req, res) => {
  const { email, name } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name
      }
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        measurements: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get User by ID
app.get('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        measurements: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update User
app.put('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { email, name } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { email, name }
    });
    res.json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete User
app.delete('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.user.delete({
      where: { id }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ===========================================
// PRODUCT ENDPOINTS
// ===========================================

// Create Product
app.post('/api/products', async (req, res) => {
  const { name, fitCategory, chest, waist, hip } = req.body;

  try {
    const product = await prisma.products.create({
      data: {
        name,
        fitCategory,
        chest: parseFloat(chest),
        waist: parseFloat(waist),
        hip: parseFloat(hip)
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get All Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.products.findMany();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get Product by ID
app.get('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const product = await prisma.products.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, fitCategory, chest, waist, hip } = req.body;

  try {
    const product = await prisma.products.update({
      where: { id },
      data: {
        name,
        fitCategory,
        chest: parseFloat(chest),
        waist: parseFloat(waist),
        hip: parseFloat(hip)
      }
    });
    res.json(product);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.products.delete({
      where: { id }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ===========================================
// USER MEASUREMENTS ENDPOINTS
// ===========================================

// Create User Measurements
app.post('/api/measurements', async (req, res) => {
  const { userId, bust, waist, hip } = req.body;

  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const measurements = await prisma.userMeasurements.create({
      data: {
        userId: parseInt(userId),
        bust: parseFloat(bust),
        waist: parseFloat(waist),
        hip: parseFloat(hip)
      }
    });
    res.status(201).json(measurements);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'User already has measurements' });
    }
    console.error('Create measurements error:', error);
    res.status(500).json({ error: 'Failed to create measurements' });
  }
});

// Get User Measurements by User ID
app.get('/api/measurements/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const measurements = await prisma.userMeasurements.findUnique({
      where: { userId },
      include: {
        user: true
      }
    });

    if (!measurements) {
      return res.status(404).json({ error: 'User measurements not found' });
    }

    res.json(measurements);
  } catch (error) {
    console.error('Get measurements error:', error);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});

// Update User Measurements
app.put('/api/measurements/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { bust, waist, hip } = req.body;

  try {
    const measurements = await prisma.userMeasurements.update({
      where: { userId },
      data: {
        bust: parseFloat(bust),
        waist: parseFloat(waist),
        hip: parseFloat(hip)
      }
    });
    res.json(measurements);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User measurements not found' });
    }
    console.error('Update measurements error:', error);
    res.status(500).json({ error: 'Failed to update measurements' });
  }
});

// Delete User Measurements
app.delete('/api/measurements/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    await prisma.userMeasurements.delete({
      where: { userId }
    });
    res.json({ message: 'User measurements deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User measurements not found' });
    }
    console.error('Delete measurements error:', error);
    res.status(500).json({ error: 'Failed to delete measurements' });
  }
});

// ===========================================
// FIT PREDICTION ENDPOINT (Your original)
// ===========================================

app.post('/api/fit-prediction', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // 1. Fetch user measurements
    const user = await prisma.userMeasurements.findUnique({
      where: { userId: userId }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User measurements not found" });
    }

    // 2. Fetch product measurements
    const product = await prisma.products.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 3. Prepare payload for ML API
    const payload = {
      user_profile: {
        user_bust_cm: user.bust,
        user_waist_cm: user.waist,
        user_hip_cm: user.hip
      },
      product_details: {
        fit_category: product.fitCategory,
        product_chest_cm: product.chest,
        product_waist_cm: product.waist,
        product_hip_cm: product.hip
      }
    };

    // 4. Call ML service
    const response = await axios.post(ML_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    // 5. Return prediction to frontend
    res.json({
      success: true,
      prediction: response.data
    });

  } catch (error) {
    console.error("Prediction error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get fit prediction"
    });
  }
});

// ===========================================
// DEFAULT ROUTE
// ===========================================

app.get('/', (req, res) => {
  res.send("Backend is running ✅");
});

// ===========================================
// START SERVER
// ===========================================

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});