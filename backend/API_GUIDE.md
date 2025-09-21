# Meesho Certainty Engine - Frontend API Guide

## Quick Start

This guide provides the essential API endpoints and usage examples for frontend developers integrating with the Meesho Certainty Engine backend.

### Setup

1. **Install Dependencies**
   ```bash
   npm install axios
   ```

2. **Base Configuration**
   ```typescript
   // api/config.ts
   export const API_CONFIG = {
     BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
     TIMEOUT: 10000,
   };
   ```

## Authentication

Currently no authentication required. All endpoints are publicly accessible.

## TypeScript Types

```typescript
// Essential types for frontend integration

export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface UserMeasurements {
  id: number;
  userId: number;
  bust: number;    // in centimeters
  waist: number;   // in centimeters
  hip: number;     // in centimeters
}

export interface Product {
  id: number;
  name: string;
  fitCategory: FitCategory;
  chest: number;   // in centimeters
  waist: number;   // in centimeters
  hip: number;     // in centimeters
}

export type FitCategory = 
  | 'upper_fitted'  // T-shirts, shirts, blouses
  | 'upper_loose'   // Hoodies, sweaters, loose tops
  | 'lower_fitted'  // Jeans, fitted pants, leggings
  | 'lower_loose'   // Loose pants, palazzo, wide-leg
  | 'dresses';      // Dresses

export type FitResult = 
  | 'Perfect Fit'
  | 'Slightly Loose'
  | 'Slightly Tight'
  | 'Too Loose'
  | 'Too Tight';

export interface FitPredictionResponse {
  success: boolean;
  prediction?: {
    predicted_fit: FitResult;
    probabilities: Record<FitResult, number>;
    model_used: FitCategory;
  };
  message?: string;
}
```

## API Endpoints

### User Management

#### Create User
**POST** `/api/users`
```typescript
// Request
const userData = { email: "user@example.com", name: "John Doe" };
const response = await axios.post(`${API_CONFIG.BASE_URL}/api/users`, userData);
// Response: User object
```

#### Get All Users
**GET** `/api/users`
```typescript
const response = await axios.get(`${API_CONFIG.BASE_URL}/api/users`);
// Response: User[] array
```

#### Get User by ID
**GET** `/api/users/:id`
```typescript
const response = await axios.get(`${API_CONFIG.BASE_URL}/api/users/1`);
// Response: User object with measurements
```

### Product Management

#### Create Product
**POST** `/api/products`
```typescript
const productData = {
  name: "Cotton T-Shirt",
  fitCategory: "upper_fitted",
  chest: 92,
  waist: 86,
  hip: 94
};
const response = await axios.post(`${API_CONFIG.BASE_URL}/api/products`, productData);
// Response: Product object
```

#### Get All Products
**GET** `/api/products`
```typescript
const response = await axios.get(`${API_CONFIG.BASE_URL}/api/products`);
// Response: Product[] array
```

### User Measurements

#### Create Measurements
**POST** `/api/measurements`
```typescript
const measurementData = {
  userId: 1,
  bust: 86,
  waist: 68,
  hip: 94
};
const response = await axios.post(`${API_CONFIG.BASE_URL}/api/measurements`, measurementData);
// Response: UserMeasurements object
```

#### Get User Measurements
**GET** `/api/measurements/:userId`
```typescript
const response = await axios.get(`${API_CONFIG.BASE_URL}/api/measurements/1`);
// Response: UserMeasurements object
```

### Fit Prediction

#### Get Fit Prediction
**POST** `/api/fit-prediction`
```typescript
const predictionRequest = { userId: 1, productId: 1 };
const response = await axios.post(`${API_CONFIG.BASE_URL}/api/fit-prediction`, predictionRequest);
// Response: FitPredictionResponse object
```

## Basic Usage Example

```typescript
// Example: Complete flow for getting fit prediction
async function getFitRecommendation(userEmail: string, productId: number) {
  try {
    // 1. Create or get user
    const user = await axios.post(`${API_CONFIG.BASE_URL}/api/users`, {
      email: userEmail,
      name: "Customer"
    });
    
    // 2. Add measurements (if not exists)
    const measurements = await axios.post(`${API_CONFIG.BASE_URL}/api/measurements`, {
      userId: user.data.id,
      bust: 86,
      waist: 68,
      hip: 94
    });
    
    // 3. Get fit prediction
    const prediction = await axios.post(`${API_CONFIG.BASE_URL}/api/fit-prediction`, {
      userId: user.data.id,
      productId: productId
    });
    
    if (prediction.data.success) {
      console.log(`Recommended fit: ${prediction.data.prediction.predicted_fit}`);
      return prediction.data.prediction;
    }
  } catch (error) {
    console.error('Error getting fit recommendation:', error);
  }
}
```

## Error Handling

Common HTTP status codes:
- **400**: Bad Request (e.g., email already exists, invalid data)
- **404**: Not Found (user/product/measurements not found)
- **500**: Internal Server Error

```typescript
// Basic error handling example
try {
  const response = await axios.post(url, data);
  return response.data;
} catch (error) {
  if (error.response?.status === 400) {
    throw new Error('Invalid request data');
  } else if (error.response?.status === 404) {
    throw new Error('Resource not found');
  } else {
    throw new Error('Server error occurred');
  }
}
```

---

*For detailed system architecture and backend setup, see [README.md](./README.md)*
