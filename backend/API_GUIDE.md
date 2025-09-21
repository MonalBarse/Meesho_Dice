# Meesho Certainty Engine - Frontend Integration Guide

## Getting Started for Frontend Developers

This guide provides everything you need to integrate with the Meesho Certainty Engine backend. Whether you're building a React application or any other frontend, this documentation includes complete examples with TypeScript interfaces, React hooks, and error handling patterns.

### What You Need to Know Before Starting

The Meesho Certainty Engine is a clothing fit prediction system that helps customers find the right size. As a frontend developer, you'll be working with:

- **User Management**: Creating and managing user profiles
- **Measurements**: Storing user body measurements for personalized recommendations
- **Products**: Displaying clothing items with detailed sizing information
- **Fit Predictions**: Getting ML-powered sizing recommendations

### Environment Setup on Frontend Side

1. **Install Required Dependencies**
   ```bash
   npm install axios
   # Optional but recommended for TypeScript projects
   npm install -D @types/axios
   ```

2. **Base Configuration**
   ```typescript
   // api/config.ts
   export const API_CONFIG = {
     BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
     TIMEOUT: 10000, // 10 seconds
   };
   ```

3. **Environment Variables**
   ```env
   # .env file
   REACT_APP_API_URL=http://localhost:3000
   ```

## Authentication

Currently, the API operates without authentication to focus on core functionality. All endpoints are publicly accessible.

### Future Authentication Implementation

When authentication is added, the pattern will be:

```typescript
// auth/authContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Example implementation (future)
const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    setToken(token);
  };

  return { token, login, logout: () => setToken(null) };
};
```

## Data Models & TypeScript Types

### Core Interfaces

```typescript
// types/api.ts

// User Management
export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  measurements?: UserMeasurements;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
}

// User Measurements
export interface UserMeasurements {
  id: number;
  userId: number;
  bust: number;    // in centimeters
  waist: number;   // in centimeters
  hip: number;     // in centimeters
  user?: User;
}

export interface CreateMeasurementsRequest {
  userId: number;
  bust: number;
  waist: number;
  hip: number;
}

export interface UpdateMeasurementsRequest {
  bust: number;
  waist: number;
  hip: number;
}

// Products
export interface Product {
  id: number;
  name: string;
  fitCategory: FitCategory;
  chest: number;   // in centimeters
  waist: number;   // in centimeters
  hip: number;     // in centimeters
}

export type FitCategory = 
  | 'upper_fitted'  // T-shirts, shirts, blouses (fitted)
  | 'upper_loose'   // Hoodies, sweaters, loose tops
  | 'lower_fitted'  // Jeans, fitted pants, leggings
  | 'lower_loose'   // Loose pants, palazzo, wide-leg
  | 'dresses';      // Dresses (uses all measurements)

export interface CreateProductRequest {
  name: string;
  fitCategory: FitCategory;
  chest: number;
  waist: number;
  hip: number;
}

// Fit Prediction
export interface FitPredictionRequest {
  userId: number;
  productId: number;
}

export interface FitPredictionResponse {
  success: boolean;
  prediction?: {
    predicted_fit: FitResult;
    probabilities: Record<FitResult, number>;
    model_used: FitCategory;
  };
  message?: string;
}

export type FitResult = 
  | 'Perfect Fit'
  | 'Slightly Loose'
  | 'Slightly Tight'
  | 'Too Loose'
  | 'Too Tight';

// API Response Wrappers
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  status?: number;
}
```

### Field Explanations

- **Measurements**: All body measurements are in centimeters for consistency
- **FitCategory**: Determines which ML model is used for predictions
- **FitResult**: Standardized fit assessment from ML models
- **Probabilities**: Confidence scores for each possible fit result

## Complete API Reference

### User Management Endpoints

#### Create User
- **HTTP Method**: `POST`
- **URL**: `/api/users`
- **Purpose**: Register a new user in the system
- **Authentication Required**: No

**Request Format**:
```typescript
interface CreateUserRequest {
  email: string;
  name: string;
}
```

**Response Format**:
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}
```

**Complete React Example**:
```typescript
// hooks/useCreateUser.ts
import { useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../api/config';

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: CreateUserRequest): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/api/users`, userData, {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setLoading(false);
      if (err.response?.status === 400) {
        setError('Email already exists');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.error || 'Failed to create user');
      }
      return null;
    }
  };

  return { createUser, loading, error };
};

// components/CreateUserForm.tsx
import React, { useState } from 'react';
import { useCreateUser } from '../hooks/useCreateUser';

export const CreateUserForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { createUser, loading, error } = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = await createUser({ email, name });
    if (user) {
      console.log('User created successfully:', user);
      // Reset form or redirect
      setEmail('');
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
};
```

**Error Responses**:
- `400 Bad Request`: Email already exists
- `500 Internal Server Error`: Server error

#### Get All Users
- **HTTP Method**: `GET`
- **URL**: `/api/users`
- **Purpose**: Retrieve all users (for admin dashboards)
- **Authentication Required**: No

**Response Format**:
```typescript
User[] // Array of User objects
```

**React Example**:
```typescript
// hooks/useUsers.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/api/users`);
        setUsers(response.data);
        setError(null);
      } catch (err: any) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error, refetch: () => fetchUsers() };
};

// components/UserList.tsx
export const UserList: React.FC = () => {
  const { users, loading, error } = useUsers();

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users ({users.length})</h2>
      {users.map(user => (
        <div key={user.id}>
          <strong>{user.name}</strong> - {user.email}
          <small> (joined: {new Date(user.createdAt).toLocaleDateString()})</small>
        </div>
      ))}
    </div>
  );
};
```

#### Get User by ID
- **HTTP Method**: `GET`
- **URL**: `/api/users/:id`
- **Purpose**: Retrieve a specific user with their measurements
- **Authentication Required**: No

**Response Format**:
```typescript
interface UserWithMeasurements extends User {
  measurements?: UserMeasurements;
}
```

**React Example**:
```typescript
// hooks/useUser.ts
export const useUser = (userId: number) => {
  const [user, setUser] = useState<UserWithMeasurements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/api/users/${userId}`);
        setUser(response.data);
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to fetch user');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
```

### Product Management Endpoints

#### Create Product
- **HTTP Method**: `POST`
- **URL**: `/api/products`
- **Purpose**: Add a new clothing item to the catalog
- **Authentication Required**: No

**Request Format**:
```typescript
interface CreateProductRequest {
  name: string;
  fitCategory: FitCategory;
  chest: number;
  waist: number;
  hip: number;
}
```

**Complete React Example**:
```typescript
// hooks/useCreateProduct.ts
export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (productData: CreateProductRequest): Promise<Product | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/api/products`, productData);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setLoading(false);
      setError('Failed to create product');
      return null;
    }
  };

  return { createProduct, loading, error };
};

// components/CreateProductForm.tsx
export const CreateProductForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    fitCategory: 'upper_fitted',
    chest: 0,
    waist: 0,
    hip: 0,
  });
  const { createProduct, loading, error } = useCreateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = await createProduct(formData);
    if (product) {
      console.log('Product created:', product);
    }
  };

  const handleInputChange = (field: keyof CreateProductRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="fitCategory">Fit Category:</label>
        <select
          id="fitCategory"
          value={formData.fitCategory}
          onChange={(e) => handleInputChange('fitCategory', e.target.value as FitCategory)}
          required
        >
          <option value="upper_fitted">Upper Fitted (T-shirts, Blouses)</option>
          <option value="upper_loose">Upper Loose (Hoodies, Sweaters)</option>
          <option value="lower_fitted">Lower Fitted (Jeans, Leggings)</option>
          <option value="lower_loose">Lower Loose (Palazzo, Wide-leg)</option>
          <option value="dresses">Dresses</option>
        </select>
      </div>

      <div>
        <label htmlFor="chest">Chest (cm):</label>
        <input
          type="number"
          id="chest"
          step="0.1"
          value={formData.chest}
          onChange={(e) => handleInputChange('chest', parseFloat(e.target.value))}
          required
        />
      </div>

      <div>
        <label htmlFor="waist">Waist (cm):</label>
        <input
          type="number"
          id="waist"
          step="0.1"
          value={formData.waist}
          onChange={(e) => handleInputChange('waist', parseFloat(e.target.value))}
          required
        />
      </div>

      <div>
        <label htmlFor="hip">Hip (cm):</label>
        <input
          type="number"
          id="hip"
          step="0.1"
          value={formData.hip}
          onChange={(e) => handleInputChange('hip', parseFloat(e.target.value))}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
};
```

#### Get All Products
- **HTTP Method**: `GET`
- **URL**: `/api/products`
- **Purpose**: Retrieve all products in the catalog
- **Authentication Required**: No

**Response Format**:
```typescript
Product[] // Array of Product objects
```

### User Measurements Endpoints

#### Create User Measurements
- **HTTP Method**: `POST`
- **URL**: `/api/measurements`
- **Purpose**: Store user body measurements for fit predictions
- **Authentication Required**: No

**Request Format**:
```typescript
interface CreateMeasurementsRequest {
  userId: number;
  bust: number;
  waist: number;
  hip: number;
}
```

**Complete React Example**:
```typescript
// components/MeasurementsForm.tsx
interface MeasurementsFormProps {
  userId: number;
  onSuccess?: (measurements: UserMeasurements) => void;
}

export const MeasurementsForm: React.FC<MeasurementsFormProps> = ({ 
  userId, 
  onSuccess 
}) => {
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hip: '',
  });
  const { createMeasurements, loading, error } = useCreateMeasurements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const measurementData = {
      userId,
      bust: parseFloat(measurements.bust),
      waist: parseFloat(measurements.waist),
      hip: parseFloat(measurements.hip),
    };

    const result = await createMeasurements(measurementData);
    if (result && onSuccess) {
      onSuccess(result);
    }
  };

  const isValidForm = measurements.bust && measurements.waist && measurements.hip;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Your Body Measurements</h3>
      <p>Please enter your measurements in centimeters for accurate fit predictions.</p>

      <div>
        <label htmlFor="bust">Bust/Chest (cm):</label>
        <input
          type="number"
          id="bust"
          step="0.1"
          min="50"
          max="200"
          value={measurements.bust}
          onChange={(e) => setMeasurements(prev => ({ ...prev, bust: e.target.value }))}
          required
          placeholder="e.g., 86.5"
        />
      </div>

      <div>
        <label htmlFor="waist">Waist (cm):</label>
        <input
          type="number"
          id="waist"
          step="0.1"
          min="40"
          max="150"
          value={measurements.waist}
          onChange={(e) => setMeasurements(prev => ({ ...prev, waist: e.target.value }))}
          required
          placeholder="e.g., 68.0"
        />
      </div>

      <div>
        <label htmlFor="hip">Hip (cm):</label>
        <input
          type="number"
          id="hip"
          step="0.1"
          min="60"
          max="200"
          value={measurements.hip}
          onChange={(e) => setMeasurements(prev => ({ ...prev, hip: e.target.value }))}
          required
          placeholder="e.g., 94.5"
        />
      </div>

      <button type="submit" disabled={loading || !isValidForm}>
        {loading ? 'Saving...' : 'Save Measurements'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
};
```

### Fit Prediction Endpoint

#### Get Fit Prediction
- **HTTP Method**: `POST`
- **URL**: `/api/fit-prediction`
- **Purpose**: Get ML-powered fit recommendation for a user and product
- **Authentication Required**: No

**Request Format**:
```typescript
interface FitPredictionRequest {
  userId: number;
  productId: number;
}
```

**Response Format**:
```typescript
interface FitPredictionResponse {
  success: boolean;
  prediction?: {
    predicted_fit: FitResult;
    probabilities: Record<FitResult, number>;
    model_used: FitCategory;
  };
  message?: string;
}
```

**Complete React Example**:
```typescript
// components/FitPredictionWidget.tsx
interface FitPredictionWidgetProps {
  userId: number;
  product: Product;
}

export const FitPredictionWidget: React.FC<FitPredictionWidgetProps> = ({ 
  userId, 
  product 
}) => {
  const [prediction, setPrediction] = useState<FitPredictionResponse | null>(null);
  const { getFitPrediction, loading, error } = useFitPrediction();

  useEffect(() => {
    const loadPrediction = async () => {
      const result = await getFitPrediction(userId, product.id);
      setPrediction(result);
    };

    if (userId && product.id) {
      loadPrediction();
    }
  }, [userId, product.id, getFitPrediction]);

  const getConfidenceLevel = (probabilities: Record<FitResult, number>, predictedFit: FitResult) => {
    const confidence = probabilities[predictedFit] || 0;
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const getFitColor = (fit: FitResult) => {
    switch (fit) {
      case 'Perfect Fit': return '#28a745';
      case 'Slightly Loose':
      case 'Slightly Tight': return '#ffc107';
      case 'Too Loose':
      case 'Too Tight': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="fit-prediction-widget loading">
        <div className="spinner">Getting your fit prediction...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fit-prediction-widget error">
        <p>Unable to get fit prediction: {error}</p>
        <button onClick={() => getFitPrediction(userId, product.id)}>
          Try Again
        </button>
      </div>
    );
  }

  if (!prediction?.success || !prediction.prediction) {
    return (
      <div className="fit-prediction-widget">
        <p>Fit prediction not available for this product.</p>
      </div>
    );
  }

  const { predicted_fit, probabilities, model_used } = prediction.prediction;
  const confidence = getConfidenceLevel(probabilities, predicted_fit);

  return (
    <div className="fit-prediction-widget success">
      <div className="prediction-header">
        <h3>Size Recommendation for {product.name}</h3>
      </div>

      <div 
        className="fit-result"
        style={{ color: getFitColor(predicted_fit) }}
      >
        <span className="fit-text">{predicted_fit}</span>
        <span className="confidence-badge">{confidence} Confidence</span>
      </div>

      <div className="probability-breakdown">
        <h4>Detailed Breakdown:</h4>
        {Object.entries(probabilities).map(([fit, probability]) => (
          <div key={fit} className="probability-bar">
            <span className="fit-label">{fit}</span>
            <div className="bar-container">
              <div 
                className="probability-fill"
                style={{ 
                  width: `${probability * 100}%`,
                  backgroundColor: fit === predicted_fit ? getFitColor(fit) : '#e9ecef'
                }}
              />
            </div>
            <span className="percentage">{(probability * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="model-info">
        <small>Analysis based on {model_used} fit model</small>
      </div>
    </div>
  );
};
```

## React Integration Patterns

### Recommended Folder Structure

```
src/
├── api/
│   ├── config.ts              # API configuration
│   ├── client.ts              # Axios instance setup
│   └── endpoints.ts           # API endpoint constants
├── hooks/
│   ├── useUsers.ts            # User management hooks
│   ├── useProducts.ts         # Product management hooks
│   ├── useMeasurements.ts     # Measurements hooks
│   └── useFitPrediction.ts    # Fit prediction hooks
├── types/
│   ├── api.ts                 # API interface definitions
│   └── common.ts              # Common type definitions
├── components/
│   ├── forms/                 # Form components
│   ├── widgets/               # Reusable widgets
│   └── common/                # Common UI components
└── utils/
    ├── validation.ts          # Input validation helpers
    └── formatting.ts          # Data formatting utilities
```

### Custom API Client Setup

```typescript
// api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from './config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for adding auth headers (future)
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token when available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for global error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic API methods
  async get<T>(url: string): Promise<T> {
    const response = await this.client.get(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

## Error Handling Guide

### All Possible Error Status Codes

| Status Code | Meaning | Common Causes | Frontend Handling |
|-------------|---------|---------------|-------------------|
| 400 | Bad Request | Email already exists, User already has measurements | Show specific error message |
| 404 | Not Found | User/Product/Measurements not found | Redirect or show "not found" state |
| 422 | Unprocessable Entity | Invalid measurements for ML model | Show validation errors |
| 500 | Internal Server Error | Database connection, ML service down | Show generic error, retry option |

### Error Handling Patterns

```typescript
// utils/errorHandling.ts
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.error || 'Invalid request data';
      case 404:
        return 'Resource not found';
      case 422:
        return 'Invalid data provided';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return 'An unexpected error occurred';
  }
};

// components/common/ErrorMessage.tsx
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  showRetry = true 
}) => (
  <div className="error-message">
    <p>{message}</p>
    {showRetry && onRetry && (
      <button onClick={onRetry} className="retry-button">
        Try Again
      </button>
    )}
  </div>
);
```

## Best Practices

### API Call Patterns to Follow

1. **Always use loading states**
   ```typescript
   const { data, loading, error } = useApiCall();
   
   if (loading) return <LoadingSpinner />;
   if (error) return <ErrorMessage message={error} />;
   ```

2. **Implement proper error boundaries**
   ```typescript
   <ErrorBoundary>
     <UserManagement />
   </ErrorBoundary>
   ```

3. **Use TypeScript interfaces consistently**
   ```typescript
   // Always type your API responses
   const response: User = await apiClient.get<User>('/api/users/1');
   ```

4. **Implement retry mechanisms**
   ```typescript
   const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await operation();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
       }
     }
   };
   ```

### Performance Optimization Tips

1. **Use React.memo for expensive components**
   ```typescript
   export const FitPredictionWidget = React.memo<FitPredictionWidgetProps>(({ 
     userId, 
     product 
   }) => {
     // Component implementation
   });
   ```

2. **Implement data caching**
   ```typescript
   // Simple cache implementation
   const cache = new Map();
   
   const getCachedData = async (key: string, fetcher: () => Promise<any>) => {
     if (cache.has(key)) {
       return cache.get(key);
     }
     
     const data = await fetcher();
     cache.set(key, data);
     return data;
   };
   ```

### Security Considerations for Frontend

1. **Validate all user inputs**
   ```typescript
   const validateMeasurements = (measurements: CreateMeasurementsRequest): string[] => {
     const errors: string[] = [];
     
     if (measurements.bust < 50 || measurements.bust > 200) {
       errors.push('Bust measurement must be between 50-200 cm');
     }
     
     // Add more validations
     return errors;
   };
   ```

2. **Use HTTPS in production**
   ```typescript
   const API_CONFIG = {
     BASE_URL: process.env.NODE_ENV === 'production' 
       ? 'https://api.meesho.com' 
       : 'http://localhost:3000',
   };
   ```

---

*This comprehensive API guide provides everything needed for seamless frontend integration with the Meesho Certainty Engine backend. For system architecture and setup information, see [README.md](./README.md).*
