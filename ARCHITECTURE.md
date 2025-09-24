# Meesho Certainty Engine - Complete Architecture Guide

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Technology Stack](#technology-stack)
4. [System Components](#system-components)
5. [Database Design](#database-design)
6. [API Architecture](#api-architecture)
7. [Machine Learning Service](#machine-learning-service)
8. [Frontend Architecture](#frontend-architecture)
9. [Data Flow & Integration](#data-flow--integration)
10. [Development Workflow](#development-workflow)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Architecture](#deployment-architecture)
13. [Monitoring & Observability](#monitoring--observability)
14. [Future Scalability](#future-scalability)

## System Overview

The Meesho Certainty Engine is an intelligent recommendation system designed to solve the core problem of product uncertainty in e-commerce, specifically focusing on fashion items. The system predicts clothing fit based on user measurements and product specifications, significantly reducing return rates and improving customer satisfaction.

### Core Problem Statement
- **Challenge**: High return rates due to sizing uncertainty in online fashion purchases
- **Solution**: ML-powered fit prediction using user body measurements and product specifications
- **Impact**: Reduced returns, increased customer confidence, improved seller satisfaction

### Business Value
- **For Customers**: Confident shopping with personalized fit recommendations
- **For Sellers**: Reduced return rates and improved product visibility
- **For Platform**: Decreased operational costs and enhanced user experience

## Architecture Principles

### 1. **Microservices Architecture**
The system is built as independent, loosely coupled services:
- **API Service**: Express.js backend handling business logic
- **ML Service**: FastAPI-based prediction engine
- **Frontend**: React-based user interface
- **Database**: PostgreSQL for persistent storage

### 2. **Separation of Concerns**
- **Data Layer**: Prisma ORM with PostgreSQL
- **Business Logic**: Express.js API routes
- **ML Logic**: Separate Python FastAPI service
- **Presentation**: React components with TypeScript

### 3. **Scalability & Performance**
- Stateless services for horizontal scaling
- Caching layer with Redis
- Optimized database queries
- Asynchronous ML predictions

## Technology Stack

### Backend Services
```
┌─────────────────┐    ┌─────────────────┐
│   Express.js    │    │    FastAPI      │
│   (Node.js)     │────│   (Python)      │
│   Port: 3000    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────┬───────────────┘
                 │
    ┌─────────────────┐    ┌─────────────────┐
    │   PostgreSQL    │    │     Redis       │
    │   Database      │    │    Cache        │
    └─────────────────┘    └─────────────────┘
```

### Frontend Stack
```
┌─────────────────────────────────────────┐
│              React Frontend             │
│  ┌─────────────────────────────────────┐ │
│  │           TypeScript               │ │
│  │  ┌───────────────┐ ┌─────────────┐ │ │
│  │  │   Tailwind    │ │   Vite      │ │ │
│  │  │     CSS       │ │   Build     │ │ │
│  │  └───────────────┘ └─────────────┘ │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Core Technologies

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Prisma ORM
- **ML Service**: Python 3.8+ with FastAPI
- **Caching**: Redis
- **HTTP Client**: Axios

#### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **State Management**: React Hooks

#### Machine Learning
- **Framework**: FastAPI
- **ML Library**: Scikit-learn
- **Model Serialization**: Joblib
- **Data Processing**: Pandas

## System Components

### 1. Express.js API Service (`backend/src/server.js`)

The main API service handles all business logic and database operations:

```javascript
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const ML_API_URL = "http://127.0.0.1:8000/predict";

// Core functionality example
app.post('/api/fit-prediction', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // 1. Fetch user measurements
    const user = await prisma.userMeasurements.findUnique({
      where: { userId: userId }
    });

    // 2. Fetch product specifications  
    const product = await prisma.products.findUnique({
      where: { id: productId }
    });

    // 3. Prepare ML service payload
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
    const response = await axios.post(ML_API_URL, payload);
    
    // 5. Return prediction
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
```

#### Key API Modules:

1. **User Management** (`/api/users`)
   - User creation and retrieval
   - Profile management
   
2. **Measurements Module** (`/api/measurements`)
   - User body measurements storage
   - Measurement validation

3. **Products Module** (`/api/products`)
   - Product catalog management
   - Specification storage

4. **Fit Prediction Module** (`/api/fit-prediction`)
   - Core ML integration
   - Recommendation generation

### 2. FastAPI ML Service (`backend/ml_fit_service/main.py`)

Dedicated machine learning service for fit predictions:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(
    title="Meesho Smart Fit Prediction API",
    version="1.0.0"
)

# Model loading configuration
MODELS_DIR = "models"
models = {}

# Load trained models on startup
for filename in os.listdir(MODELS_DIR):
    if filename.endswith(".pkl"):
        category = filename.replace("_model.pkl", "")
        models[category] = joblib.load(os.path.join(MODELS_DIR, filename))

# Feature configuration for different garment types
CATEGORY_FEATURES = {
    "upper_fitted": ["user_bust_cm", "user_waist_cm", "product_chest_cm", "product_waist_cm"],
    "upper_loose":  ["user_bust_cm", "product_chest_cm"],
    "lower_fitted": ["user_waist_cm", "user_hip_cm", "product_waist_cm", "product_hip_cm"],
    "lower_loose":  ["user_waist_cm", "user_hip_cm", "product_waist_cm", "product_hip_cm"],
    "dresses":      ["user_bust_cm", "user_waist_cm", "user_hip_cm", 
                     "product_chest_cm", "product_waist_cm", "product_hip_cm"]
}

# Pydantic models for request validation
class UserProfile(BaseModel):
    user_bust_cm: Optional[float] = None
    user_waist_cm: Optional[float] = None
    user_hip_cm: Optional[float] = None

class ProductDetails(BaseModel):
    fit_category: str
    product_chest_cm: Optional[float] = None
    product_waist_cm: Optional[float] = None
    product_hip_cm: Optional[float] = None

class PredictionRequest(BaseModel):
    user_profile: UserProfile
    product_details: ProductDetails

@app.post("/predict")
def predict_fit(request: PredictionRequest):
    """
    Predicts clothing fit based on user measurements and product specifications.
    Returns fit recommendation with confidence score.
    """
    try:
        fit_category = request.product_details.fit_category
        
        if fit_category not in models:
            raise HTTPException(status_code=400, f"Unsupported category: {fit_category}")
        
        # Extract required features for this category
        features = CATEGORY_FEATURES[fit_category]
        
        # Prepare feature vector
        feature_data = {}
        for feature in features:
            if feature.startswith("user_"):
                value = getattr(request.user_profile, feature)
            else:
                value = getattr(request.product_details, feature)
            feature_data[feature] = value
        
        # Create DataFrame for prediction
        df = pd.DataFrame([feature_data])
        
        # Make prediction
        model = models[fit_category]
        prediction = model.predict(df)[0]
        probabilities = model.predict_proba(df)[0]
        
        return {
            "fit_recommendation": prediction,
            "confidence": max(probabilities),
            "category": fit_category,
            "probabilities": {
                "too_tight": probabilities[0],
                "perfect_fit": probabilities[1], 
                "too_loose": probabilities[2]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 3. React Frontend (`frontend/src/`)

Component-based React application with TypeScript:

```typescript
// App.tsx - Main application routing
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/landing';
import Product from './pages/Product';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path='/product' element={<Product/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### Key Frontend Components:

1. **MeasurementForm Component** - User body measurement input
2. **SizeRecommendation Component** - ML prediction display
3. **ProductCard Component** - Product listing with fit indicators
4. **ProductInfo Component** - Detailed product specifications

Example of the core measurement form component:

```typescript
// components/Measurementform.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface MeasurementFormProps {
  userId: number;
  onSuccess?: (measurements: any) => void;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({ 
  userId, 
  onSuccess 
}) => {
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hip: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/measurements', {
        userId,
        bust: parseFloat(measurements.bust),
        waist: parseFloat(measurements.waist),
        hip: parseFloat(measurements.hip)
      });

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      setError('Failed to save measurements');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="measurement-form">
      <div className="form-group">
        <label htmlFor="bust">Bust (cm):</label>
        <input
          type="number"
          id="bust"
          step="0.1"
          min="60"
          max="150"
          value={measurements.bust}
          onChange={(e) => setMeasurements(prev => ({ 
            ...prev, 
            bust: e.target.value 
          }))}
          required
          placeholder="e.g., 86.5"
        />
      </div>
      
      {/* Similar inputs for waist and hip */}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Measurements'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};
```

## Database Design

### Schema Overview (`backend/prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                Int                @id @default(autoincrement())
  email             String             @unique
  name              String?
  measurements      UserMeasurements?
  createdAt         DateTime           @default(now())
}

model UserMeasurements {
  id        Int    @id @default(autoincrement())
  userId    Int    @unique
  bust      Float  // In centimeters
  waist     Float  // In centimeters  
  hip       Float  // In centimeters

  user      User   @relation(fields: [userId], references: [id])
}

model Products {
  id           Int     @id @default(autoincrement())
  name         String
  fitCategory  String  // "upper_fitted", "upper_loose", "lower_fitted", "lower_loose", "dresses"
  chest        Float   // In centimeters
  waist        Float   // In centimeters
  hip          Float   // In centimeters
}
```

### Entity Relationships

```
┌─────────────────┐    ┌─────────────────────┐
│      User       │    │  UserMeasurements   │
├─────────────────┤    ├─────────────────────┤
│ id (PK)         │────│ userId (FK)         │
│ email (UNIQUE)  │    │ bust                │
│ name            │    │ waist               │
│ createdAt       │    │ hip                 │
└─────────────────┘    └─────────────────────┘

┌─────────────────┐
│    Products     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ fitCategory     │
│ chest           │
│ waist           │
│ hip             │
└─────────────────┘
```

### Database Operations Examples

```javascript
// Creating a user with measurements
const createUserWithMeasurements = async (userData) => {
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      measurements: {
        create: {
          bust: userData.measurements.bust,
          waist: userData.measurements.waist,
          hip: userData.measurements.hip
        }
      }
    },
    include: {
      measurements: true
    }
  });
  return user;
};

// Fetching user with measurements for predictions
const getUserForPrediction = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      measurements: true
    }
  });
};

// Product queries with fit category filtering
const getProductsByCategory = async (fitCategory) => {
  return await prisma.products.findMany({
    where: {
      fitCategory: fitCategory
    }
  });
};
```

## API Architecture

### RESTful API Design

The API follows REST principles with clear resource-based URLs:

```
┌─────────────────────────────────────────────────────────┐
│                    API Endpoints                        │
├─────────────────────────────────────────────────────────┤
│  Users Module                                           │
│  POST   /api/users              - Create user           │
│  GET    /api/users              - List users            │
│  GET    /api/users/:id          - Get specific user     │
│                                                         │
│  Measurements Module                                    │
│  POST   /api/measurements       - Create measurements   │
│  GET    /api/measurements/:userId - Get user measurements│
│  PUT    /api/measurements/:userId - Update measurements │
│                                                         │
│  Products Module                                        │
│  POST   /api/products           - Create product        │
│  GET    /api/products           - List products         │
│  GET    /api/products/:id       - Get specific product  │
│                                                         │
│  Fit Prediction Module                                  │
│  POST   /api/fit-prediction     - Get fit prediction    │
└─────────────────────────────────────────────────────────┘
```

### Request/Response Examples

#### Create User Measurements

**Request:**
```http
POST /api/measurements
Content-Type: application/json

{
  "userId": 1,
  "bust": 86.5,
  "waist": 68.0,
  "hip": 94.5
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "bust": 86.5,
  "waist": 68.0,
  "hip": 94.5
}
```

#### Get Fit Prediction

**Request:**
```http
POST /api/fit-prediction
Content-Type: application/json

{
  "userId": 1,
  "productId": 5
}
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "fit_recommendation": "perfect_fit",
    "confidence": 0.87,
    "category": "upper_fitted",
    "probabilities": {
      "too_tight": 0.05,
      "perfect_fit": 0.87,
      "too_loose": 0.08
    }
  }
}
```

### Error Handling

Comprehensive error handling with appropriate HTTP status codes:

```javascript
// Error handling middleware
app.use((error, req, res, next) => {
  const errorResponse = {
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  // Database constraint errors
  if (error.code === 'P2002') {
    return res.status(400).json({
      ...errorResponse,
      message: 'Resource already exists'
    });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(422).json({
      ...errorResponse,
      errors: error.errors
    });
  }

  // Default server error
  res.status(500).json(errorResponse);
});
```

## Machine Learning Service

### Model Training Pipeline (`backend/ml_fit_service/train.py`)

The ML service uses a systematic approach to train fit prediction models:

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# Load and prepare training data
def prepare_training_data(csv_path):
    """
    Load and preprocess the fit dataset for model training.
    """
    df = pd.read_csv(csv_path)
    
    # Feature engineering
    df['bust_diff'] = df['product_chest_cm'] - df['user_bust_cm']
    df['waist_diff'] = df['product_waist_cm'] - df['user_waist_cm']
    df['hip_diff'] = df['product_hip_cm'] - df['user_hip_cm']
    
    # Encode fit labels
    fit_mapping = {
        'too_tight': 0,
        'perfect_fit': 1, 
        'too_loose': 2
    }
    df['fit_label'] = df['fit_rating'].map(fit_mapping)
    
    return df

# Train models for each fit category
def train_category_models(df):
    """
    Train separate models for different garment categories.
    """
    models = {}
    
    for category in df['fit_category'].unique():
        print(f"Training model for category: {category}")
        
        # Filter data for this category
        category_df = df[df['fit_category'] == category].copy()
        
        # Select features based on category
        feature_columns = CATEGORY_FEATURES.get(category, [])
        if not feature_columns:
            continue
            
        X = category_df[feature_columns]
        y = category_df['fit_label']
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train Random Forest model
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"  Accuracy: {accuracy:.3f}")
        print(f"  Classification Report:")
        print(classification_report(y_test, y_pred))
        
        # Save model
        model_filename = f"models/{category}_model.pkl"
        joblib.dump(model, model_filename)
        models[category] = model
        
        print(f"  Model saved: {model_filename}")
    
    return models

# Example usage
if __name__ == "__main__":
    # Load and prepare data
    df = prepare_training_data("fit_dataset.csv")
    
    # Train models
    models = train_category_models(df)
    
    print(f"\nTrained {len(models)} models successfully!")
```

### Model Performance Testing

```python
# Model testing and validation
def test_prediction_pipeline():
    """
    Test the complete prediction pipeline with sample data.
    """
    test_cases = [
        {
            "category": "upper_fitted",
            "user_profile": {
                "user_bust_cm": 91,
                "user_waist_cm": 78,
            },
            "product_details": {
                "product_chest_cm": 92,
                "product_waist_cm": 80,
            },
            "expected": "perfect_fit"
        },
        {
            "category": "dresses",
            "user_profile": {
                "user_bust_cm": 106,
                "user_waist_cm": 88,
                "user_hip_cm": 109
            },
            "product_details": {
                "product_chest_cm": 108,
                "product_waist_cm": 90,
                "product_hip_cm": 112
            },
            "expected": "perfect_fit"
        }
    ]
    
    for i, test_case in enumerate(test_cases):
        print(f"\nTest Case {i+1}: {test_case['category']}")
        
        # Simulate API call
        prediction = predict_fit(test_case)
        
        print(f"  Prediction: {prediction['fit_recommendation']}")
        print(f"  Confidence: {prediction['confidence']:.2f}")
        print(f"  Expected: {test_case['expected']}")
        
        # Validate prediction
        assert prediction['fit_recommendation'] == test_case['expected']
        
    print("\nAll test cases passed!")

# Run tests
test_prediction_pipeline()
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Router
│   ├── Landing Page
│   │   ├── Header
│   │   ├── Banner
│   │   ├── CategoryNav
│   │   ├── ProductGrid
│   │   │   └── ProductCard[]
│   │   └── Footer
│   └── Product Page
│       ├── ProductGallery
│       ├── ProductInfo
│       ├── SizeRecommendation
│       ├── MeasurementForm
│       ├── CustomerReviews
│       └── RelatedProducts
```

### State Management Patterns

#### Custom Hooks for API Integration

```typescript
// hooks/useFitPrediction.ts
import { useState } from 'react';
import axios from 'axios';

interface FitPredictionResult {
  fit_recommendation: string;
  confidence: number;
  probabilities: {
    too_tight: number;
    perfect_fit: number;
    too_loose: number;
  };
}

export const useFitPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<FitPredictionResult | null>(null);

  const getPrediction = async (userId: number, productId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/fit-prediction', {
        userId,
        productId
      });

      setPrediction(response.data.prediction);
      return response.data.prediction;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get prediction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    prediction,
    loading,
    error,
    getPrediction
  };
};
```

#### Size Recommendation Component

```typescript
// components/SizeRecommendation.tsx
import React, { useEffect } from 'react';
import { useFitPrediction } from '../hooks/useFitPrediction';

interface SizeRecommendationProps {
  userId: number;
  productId: number;
}

export const SizeRecommendation: React.FC<SizeRecommendationProps> = ({
  userId,
  productId
}) => {
  const { prediction, loading, error, getPrediction } = useFitPrediction();

  useEffect(() => {
    if (userId && productId) {
      getPrediction(userId, productId);
    }
  }, [userId, productId]);

  const getRecommendationText = (recommendation: string, confidence: number) => {
    const messages = {
      perfect_fit: `✅ Great Fit! ${(confidence * 100).toFixed(0)}% confidence this will fit perfectly`,
      too_tight: `⚠️ Might be tight. Consider sizing up for better comfort`,
      too_loose: `⚠️ Might be loose. Consider sizing down for better fit`
    };
    
    return messages[recommendation as keyof typeof messages] || 'Unable to determine fit';
  };

  const getRecommendationStyle = (recommendation: string) => {
    const styles = {
      perfect_fit: 'bg-green-100 text-green-800 border-green-200',
      too_tight: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      too_loose: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return styles[recommendation as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-16 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Analyzing fit...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${getRecommendationStyle(prediction.fit_recommendation)}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Smart Fit Recommendation</h3>
          <p className="mt-1">
            {getRecommendationText(prediction.fit_recommendation, prediction.confidence)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-75">Confidence</div>
          <div className="text-2xl font-bold">
            {(prediction.confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>
      
      {/* Probability breakdown */}
      <div className="mt-3 space-y-1">
        <div className="text-xs opacity-75">Fit Probability Breakdown:</div>
        <div className="flex space-x-4 text-xs">
          <span>Too Tight: {(prediction.probabilities.too_tight * 100).toFixed(0)}%</span>
          <span>Perfect: {(prediction.probabilities.perfect_fit * 100).toFixed(0)}%</span>
          <span>Too Loose: {(prediction.probabilities.too_loose * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
```

## Data Flow & Integration

### Complete Request Flow

```
1. User Views Product
   │
   ├── Frontend: Product page loads
   │   └── React component renders
   │
2. User Triggers Fit Check
   │
   ├── Frontend: SizeRecommendation component
   │   └── Calls useFitPrediction hook
   │
3. API Request to Backend
   │
   ├── Express.js: /api/fit-prediction
   │   ├── Validates request
   │   ├── Fetches user measurements (Prisma)
   │   ├── Fetches product specifications (Prisma)
   │   └── Prepares ML service payload
   │
4. ML Service Prediction
   │
   ├── FastAPI: /predict endpoint  
   │   ├── Validates input data
   │   ├── Selects appropriate model
   │   ├── Processes features
   │   └── Returns prediction + confidence
   │
5. Response Assembly
   │
   ├── Express.js: Formats response
   │   └── Returns to frontend
   │
6. UI Update
   │
   └── Frontend: Displays recommendation
       └── User sees fit advice
```

### Integration Testing Example

```javascript
// Integration test for complete flow
describe('Fit Prediction Integration', () => {
  let testUser, testProduct;

  beforeAll(async () => {
    // Setup test data
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        measurements: {
          create: {
            bust: 86.5,
            waist: 68.0,
            hip: 94.5
          }
        }
      }
    });

    testProduct = await prisma.products.create({
      data: {
        name: 'Test T-Shirt',
        fitCategory: 'upper_fitted',
        chest: 88.0,
        waist: 70.0,
        hip: 96.0
      }
    });
  });

  test('Complete fit prediction flow', async () => {
    // 1. Make API request
    const response = await request(app)
      .post('/api/fit-prediction')
      .send({
        userId: testUser.id,
        productId: testProduct.id
      });

    // 2. Verify response structure
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.prediction).toHaveProperty('fit_recommendation');
    expect(response.body.prediction).toHaveProperty('confidence');
    expect(response.body.prediction).toHaveProperty('probabilities');

    // 3. Verify prediction quality
    expect(['too_tight', 'perfect_fit', 'too_loose'])
      .toContain(response.body.prediction.fit_recommendation);
    
    expect(response.body.prediction.confidence).toBeGreaterThan(0);
    expect(response.body.prediction.confidence).toBeLessThanOrEqual(1);
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.userMeasurements.deleteMany();
    await prisma.user.deleteMany();
    await prisma.products.deleteMany();
  });
});
```

## Development Workflow

### Environment Setup

#### Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your database URL and other configurations

# 4. Setup database
createdb meesho_certainty_engine
npx prisma migrate dev
npx prisma generate

# 5. Setup ML service
cd ml_fit_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 6. Train initial models (if needed)
python train.py
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running the Complete System

```bash
# Terminal 1: Start ML Service
cd backend/ml_fit_service
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2: Start API Server
cd backend
node src/server.js

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

### Development Scripts

#### Backend Scripts
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest",
    "db:migrate": "npx prisma migrate dev",
    "db:generate": "npx prisma generate",
    "db:studio": "npx prisma studio",
    "ml:train": "cd ml_fit_service && python train.py"
  }
}
```

#### Frontend Scripts  
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build", 
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

## Testing Strategy

### Unit Testing

#### Backend API Tests
```javascript
// tests/api/users.test.js
const request = require('supertest');
const app = require('../src/server');

describe('User API', () => {
  describe('POST /api/users', () => {
    test('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.id).toBeDefined();
    });

    test('should reject duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        name: 'Test User'
      };

      // Create first user
      await request(app)
        .post('/api/users')
        .send(userData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });
  });
});
```

#### ML Service Tests
```python
# tests/test_ml_service.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test ML service health endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "models_loaded" in response.json()

def test_prediction_upper_fitted():
    """Test prediction for upper fitted garments."""
    payload = {
        "user_profile": {
            "user_bust_cm": 91.0,
            "user_waist_cm": 78.0
        },
        "product_details": {
            "fit_category": "upper_fitted",
            "product_chest_cm": 92.0,
            "product_waist_cm": 80.0
        }
    }
    
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "fit_recommendation" in data
    assert "confidence" in data
    assert data["fit_recommendation"] in ["too_tight", "perfect_fit", "too_loose"]
    assert 0 <= data["confidence"] <= 1

def test_prediction_missing_features():
    """Test prediction with missing required features."""
    payload = {
        "user_profile": {
            "user_bust_cm": 91.0
            # Missing waist measurement
        },
        "product_details": {
            "fit_category": "upper_fitted",
            "product_chest_cm": 92.0,
            "product_waist_cm": 80.0
        }
    }
    
    response = client.post("/predict", json=payload)
    assert response.status_code == 400
```

### Frontend Testing

#### Component Testing with React Testing Library
```typescript
// tests/components/SizeRecommendation.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { SizeRecommendation } from '../../src/components/SizeRecommendation';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SizeRecommendation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    render(<SizeRecommendation userId={1} productId={1} />);
    
    expect(screen.getByText('Analyzing fit...')).toBeInTheDocument();
  });

  test('displays fit recommendation after successful API call', async () => {
    const mockPrediction = {
      data: {
        success: true,
        prediction: {
          fit_recommendation: 'perfect_fit',
          confidence: 0.87,
          probabilities: {
            too_tight: 0.05,
            perfect_fit: 0.87,
            too_loose: 0.08
          }
        }
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockPrediction);

    render(<SizeRecommendation userId={1} productId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Great Fit! 87% confidence/)).toBeInTheDocument();
    });

    expect(screen.getByText('Smart Fit Recommendation')).toBeInTheDocument();
  });

  test('displays error message on API failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    render(<SizeRecommendation userId={1} productId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to get prediction/)).toBeInTheDocument();
    });
  });
});
```

### End-to-End Testing

```javascript
// e2e/fit-prediction.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Fit Prediction Flow', () => {
  test('complete user journey for fit prediction', async ({ page }) => {
    // 1. Navigate to product page
    await page.goto('/product?id=1');
    
    // 2. Check if measurements form is visible
    await expect(page.locator('.measurement-form')).toBeVisible();
    
    // 3. Fill in measurements
    await page.fill('[data-testid="bust-input"]', '86.5');
    await page.fill('[data-testid="waist-input"]', '68.0');
    await page.fill('[data-testid="hip-input"]', '94.5');
    
    // 4. Submit measurements
    await page.click('[data-testid="save-measurements"]');
    
    // 5. Wait for fit recommendation to appear
    await expect(page.locator('.size-recommendation')).toBeVisible();
    
    // 6. Verify recommendation content
    const recommendation = page.locator('.size-recommendation');
    await expect(recommendation).toContainText('Smart Fit Recommendation');
    await expect(recommendation).toContainText(/%/); // Confidence percentage
    
    // 7. Verify recommendation styling based on fit result
    const recommendationClass = await recommendation.getAttribute('class');
    expect(['bg-green-100', 'bg-yellow-100']).toContain(
      recommendationClass.split(' ').find(cls => cls.startsWith('bg-'))
    );
  });
});
```

## Deployment Architecture

### Production Environment

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: meesho_certainty_engine
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # ML Service
  ml-service:
    build: 
      context: ./backend/ml_fit_service
    environment:
      - PYTHONPATH=/app
    ports:
      - "8000:8000"
    depends_on:
      - redis

  # API Backend
  api-backend:
    build: 
      context: ./backend
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@database:5432/meesho_certainty_engine
      ML_API_URL: http://ml-service:8000
      REDIS_URL: redis://redis:6379
    ports:
      - "3000:3000"
    depends_on:
      - database
      - redis
      - ml-service

  # Frontend (Nginx + React)
  frontend:
    build: 
      context: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api-backend

volumes:
  postgres_data:
```

### Kubernetes Deployment

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-backend
  template:
    metadata:
      labels:
        app: api-backend
    spec:
      containers:
      - name: api-backend
        image: meesho-certainty-engine/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: ML_API_URL
          value: "http://ml-service:8000"
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: api-backend-service
spec:
  selector:
    app: api-backend
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Environment Configurations

#### Development
```env
# .env.development
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/meesho_dev
ML_API_URL=http://127.0.0.1:8000
REDIS_URL=redis://localhost:6379
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

#### Production
```env
# .env.production
NODE_ENV=production
DATABASE_URL=${DATABASE_URL}
ML_API_URL=http://ml-service:8000
REDIS_URL=redis://redis:6379
PORT=3000
CORS_ORIGIN=https://your-domain.com
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
          
      - name: Install Backend Dependencies
        run: |
          cd backend
          npm install
          
      - name: Install ML Dependencies
        run: |
          cd backend/ml_fit_service
          pip install -r requirements.txt
          
      - name: Run Backend Tests
        run: |
          cd backend
          npm test
          
      - name: Run ML Tests
        run: |
          cd backend/ml_fit_service
          python -m pytest
          
      - name: Install Frontend Dependencies
        run: |
          cd frontend
          npm install
          
      - name: Build Frontend
        run: |
          cd frontend
          npm run build
          
      - name: Run Frontend Tests
        run: |
          cd frontend
          npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Production
        run: |
          # Add your deployment commands here
          echo "Deploying to production..."
```

## Monitoring & Observability

### Health Check Endpoints

```javascript
// Health check implementation
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {}
  };

  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'degraded';
  }

  try {
    // Check ML service
    const mlResponse = await axios.get('http://127.0.0.1:8000/', { timeout: 5000 });
    health.services.ml_service = 'healthy';
  } catch (error) {
    health.services.ml_service = 'unhealthy';
    health.status = 'degraded';
  }

  // Check Redis if configured
  if (process.env.REDIS_URL) {
    try {
      // Add Redis health check here
      health.services.cache = 'healthy';
    } catch (error) {
      health.services.cache = 'unhealthy';
    }
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### Logging Strategy

```javascript
// Structured logging implementation
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'meesho-certainty-engine',
    version: process.env.APP_VERSION || '1.0.0'
  },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Usage throughout the application
app.post('/api/fit-prediction', async (req, res) => {
  const startTime = Date.now();
  const { userId, productId } = req.body;
  
  logger.info('Fit prediction request started', {
    userId,
    productId,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    // ... prediction logic ...
    
    const duration = Date.now() - startTime;
    logger.info('Fit prediction completed successfully', {
      userId,
      productId,
      duration,
      prediction: response.data.fit_recommendation
    });
    
    res.json(result);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Fit prediction failed', {
      userId,
      productId,
      duration,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ success: false, message: 'Prediction failed' });
  }
});
```

### Performance Metrics

```javascript
// Metrics collection using Prometheus
const promClient = require('prom-client');

// Create metrics
const httpDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const predictionCounter = new promClient.Counter({
  name: 'fit_predictions_total',
  help: 'Total number of fit predictions',
  labelNames: ['category', 'recommendation']
});

const modelAccuracy = new promClient.Gauge({
  name: 'ml_model_accuracy',
  help: 'Current ML model accuracy score',
  labelNames: ['category']
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    httpDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration);
  });
  
  next();
});

// Expose metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});
```

## Future Scalability

### Horizontal Scaling Strategy

```
┌─────────────────────────────────────────┐
│              Load Balancer              │
│           (API Gateway)                 │
└─────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ API Server  │ │ API Server  │ │ API Server  │
│ Instance 1  │ │ Instance 2  │ │ Instance N  │
└─────────────┘ └─────────────┘ └─────────────┘
         │           │           │
         └───────────┼───────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ ML Service  │ │ ML Service  │ │ ML Service  │
│ Instance 1  │ │ Instance 2  │ │ Instance N  │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Microservices Evolution

```
Current Architecture:
┌─────────────┐    ┌─────────────┐
│ API Service │────│ ML Service  │
└─────────────┘    └─────────────┘

Future Microservices:
┌─────────────────┐    ┌─────────────────┐
│ User Service    │    │ Product Service │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────┬───────────────┘
                 │
┌─────────────────────────────────────────┐
│         Fit Prediction Service          │
├─────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────┐ │
│  │ ML Service  │    │ Recommendation  │ │
│  │             │    │ Engine          │ │
│  └─────────────┘    └─────────────────┘ │
└─────────────────────────────────────────┘
         │                       │
┌─────────────────┐    ┌─────────────────┐
│ Analytics       │    │ Feedback        │
│ Service         │    │ Service         │
└─────────────────┘    └─────────────────┘
```

### Caching Strategy

```javascript
// Multi-layer caching implementation
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// L1: In-memory cache for frequently accessed models
const modelCache = new Map();

// L2: Redis cache for user data and predictions
const cacheUserMeasurements = async (userId, measurements) => {
  const key = `user:${userId}:measurements`;
  await client.setex(key, 3600, JSON.stringify(measurements)); // 1 hour TTL
};

const getCachedUserMeasurements = async (userId) => {
  const key = `user:${userId}:measurements`;
  const cached = await client.get(key);
  return cached ? JSON.parse(cached) : null;
};

// L3: Database with optimized queries
const getUserMeasurementsOptimized = async (userId) => {
  // Try cache first
  let measurements = await getCachedUserMeasurements(userId);
  
  if (!measurements) {
    // Fallback to database
    measurements = await prisma.userMeasurements.findUnique({
      where: { userId },
      select: { bust: true, waist: true, hip: true } // Only select needed fields
    });
    
    if (measurements) {
      await cacheUserMeasurements(userId, measurements);
    }
  }
  
  return measurements;
};
```

### Database Optimization

```sql
-- Optimized indexes for common queries
CREATE INDEX idx_user_measurements_user_id ON user_measurements(user_id);
CREATE INDEX idx_products_fit_category ON products(fit_category);
CREATE INDEX idx_users_email ON users(email);

-- Partitioning strategy for large datasets
CREATE TABLE product_fit_feedback_partitioned (
    id SERIAL,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    fit_rating SMALLINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Monthly partitions
CREATE TABLE product_fit_feedback_2024_01 PARTITION OF product_fit_feedback_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Category Expansion Framework

```javascript
// Extensible category configuration
const CATEGORY_CONFIGS = {
  fashion: {
    categories: ['upper_fitted', 'upper_loose', 'lower_fitted', 'lower_loose', 'dresses'],
    features: {
      upper_fitted: ['user_bust_cm', 'user_waist_cm', 'product_chest_cm', 'product_waist_cm'],
      // ... other categories
    },
    models_path: './models/fashion/'
  },
  
  footwear: {
    categories: ['sneakers', 'boots', 'sandals', 'formal'],
    features: {
      sneakers: ['user_foot_length_cm', 'user_foot_width_cm', 'product_length_cm', 'product_width_cm'],
      // ... other categories
    },
    models_path: './models/footwear/'
  },
  
  home_goods: {
    categories: ['bedsheets', 'curtains', 'furniture'],
    features: {
      bedsheets: ['user_bed_length_cm', 'user_bed_width_cm', 'product_length_cm', 'product_width_cm'],
      // ... other categories  
    },
    models_path: './models/home_goods/'
  }
};

// Dynamic model loading for multiple categories
const loadCategoryModels = async (category) => {
  const config = CATEGORY_CONFIGS[category];
  if (!config) {
    throw new Error(`Unsupported category: ${category}`);
  }
  
  const models = {};
  for (const subcategory of config.categories) {
    const modelPath = `${config.models_path}${subcategory}_model.pkl`;
    if (fs.existsSync(modelPath)) {
      models[subcategory] = await loadModel(modelPath);
    }
  }
  
  return models;
};
```

---

## Conclusion

This architecture documentation provides a complete understanding of the Meesho Certainty Engine codebase. The system is built with scalability, maintainability, and performance in mind, using modern web technologies and best practices.

### Key Takeaways:

1. **Modular Architecture**: Clear separation between API service, ML service, and frontend
2. **Scalable Design**: Microservices approach with independent scaling capabilities  
3. **Production Ready**: Comprehensive testing, monitoring, and deployment strategies
4. **Future Proof**: Extensible framework for expanding to new product categories

### Next Steps for Developers:

1. **Start Local Development**: Follow the development workflow section to set up your environment
2. **Understand the Data Flow**: Study the integration patterns and API contracts
3. **Explore ML Models**: Examine the training pipeline and prediction logic
4. **Contribute**: Use the testing strategies to validate your changes
5. **Deploy**: Follow the deployment guides for staging and production environments

This documentation serves as your complete reference for understanding, extending, and maintaining the Meesho Certainty Engine.