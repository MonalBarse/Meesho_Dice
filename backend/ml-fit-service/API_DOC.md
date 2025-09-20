# Meesho Smart Fit Prediction API

## 1. Overview

The **Meesho Smart Fit Prediction API** provides real-time, personalized clothing fit predictions for Meesho customers. Built as a standalone microservice, it can be seamlessly integrated with any backend system to deliver intelligent fit recommendations.

### Key Benefits:
- **Reduces Return Rates**: Accurate fit predictions minimize product uncertainty
- **Boosts Conversion**: Increases customer confidence during purchase decisions  
- **Saves Costs**: Reduces operational overhead from returns and exchanges
- **Scalable Architecture**: Supports multiple clothing categories with specialized ML models

### Supported Clothing Categories:
- **Upper Fitted**: T-shirts, fitted kurtis, blouses, tank tops, shirts
- **Upper Loose**: Oversized shirts, loose kurtis, hoodies, ponchos, kaftans  
- **Lower Fitted**: Jeans, formal pants, leggings, skinny pants
- **Lower Loose**: Joggers, palazzo pants, wide-leg pants
- **Dresses**: Midi dresses, maxi dresses, bodycon dresses

---

## 2. The Logic: How It Works (For Code Checkers)

The system is designed for scalability and accuracy, moving beyond a naive "one-model-per-product" approach.

### 2.1. Hierarchical Fit Categories

Instead of training a model for every unique product type (e.g., "crop top," "jeans"), we group products into **fit categories** based on their physical properties. For example:

- `upper_fitted`: (T-shirts, Fitted Kurtis, Blouses)
- `lower_fitted`: (Jeans, Leggings, Formal Pants)

This reduces the number of models from thousands to less than ten, making the system highly maintainable and scalable.

### 2.2. Specialist Models

A separate, specialist Machine Learning model (`RandomForestClassifier`) is trained for each `fit_category`. Each model learns the specific relationships between user measurements and product measurements relevant to that category. For example, the `upper_fitted` model focuses on bust and waist, while the `lower_fitted` model focuses on waist and hip.

### 2.3. How to Run Locally

To run this service for testing:

1.  Navigate to this directory: `cd backend/ml-fit-service/`
2.  Create a virtual environment: `python3 -m venv venv`
3.  Activate it: `source venv/bin/activate`
4.  Install dependencies: `pip install -r requirements.txt`
5.  Start the server: `uvicorn main:app --reload`
    The API will then be available at `http://127.0.0.1:8000`.

---

## 3. Integration Guide (For Backend Developers)

This section provides comprehensive details for integrating the Meesho Smart Fit Prediction API into your application.

### 3.1. API Endpoints

#### Health Check Endpoint
- **URL:** `http://127.0.0.1:8000/`
- **Method:** `GET`
- **Description:** Check API status and loaded models
- **Response:**
```json
{
  "status": "Healthy",
  "loaded_models": ["upper_fitted", "upper_loose", "lower_fitted", "lower_loose", "dresses"]
}
```

#### Main Prediction Endpoint  
- **URL:** `http://127.0.0.1:8000/predict`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Description:** Get fit prediction for user and product combination

### 3.2. Complete Input Schema

The API expects a JSON object with two main sections: `user_profile` and `product_details`.

#### User Profile Parameters
All user measurements are **optional** but you must provide the ones required by the product's fit category.

| Parameter | Type | Description | Range | Required For Categories |
|-----------|------|-------------|-------|------------------------|
| `user_bust_cm` | float | User's bust/chest measurement in cm | 75-125 | upper_fitted, upper_loose, dresses |
| `user_waist_cm` | float | User's waist measurement in cm | 60-115 | upper_fitted, lower_fitted, lower_loose, dresses |
| `user_hip_cm` | float | User's hip measurement in cm | 85-135 | lower_fitted, lower_loose, dresses |

#### Product Details Parameters
Product measurements are **optional** except for `fit_category` which is **required**.

| Parameter | Type | Description | Required For Categories |
|-----------|------|-------------|------------------------|
| `fit_category` | string | **REQUIRED** - Product fit category | ALL |
| `product_chest_cm` | float | Product chest measurement in cm | upper_fitted, upper_loose, dresses |
| `product_waist_cm` | float | Product waist measurement in cm | upper_fitted, lower_fitted, lower_loose, dresses |
| `product_hip_cm` | float | Product hip measurement in cm | lower_fitted, lower_loose, dresses |

#### Fit Categories and Required Fields

| Fit Category | Required User Fields | Required Product Fields | Example Products |
|--------------|---------------------|------------------------|------------------|
| `upper_fitted` | `user_bust_cm`, `user_waist_cm` | `product_chest_cm`, `product_waist_cm` | T-shirts, fitted kurtis, blouses |
| `upper_loose` | `user_bust_cm` | `product_chest_cm` | Oversized shirts, hoodies |
| `lower_fitted` | `user_waist_cm`, `user_hip_cm` | `product_waist_cm`, `product_hip_cm` | Jeans, leggings, formal pants |
| `lower_loose` | `user_waist_cm`, `user_hip_cm` | `product_waist_cm`, `product_hip_cm` | Joggers, palazzo pants |
| `dresses` | `user_bust_cm`, `user_waist_cm`, `user_hip_cm` | `product_chest_cm`, `product_waist_cm`, `product_hip_cm` | Midi dress, maxi dress |

#### Example Request Payloads

**Upper Fitted (T-shirt, Blouse):**
```json
{
  "user_profile": {
    "user_bust_cm": 91,
    "user_waist_cm": 78
  },
  "product_details": {
    "fit_category": "upper_fitted",
    "product_chest_cm": 92,
    "product_waist_cm": 80
  }
}
```

**Lower Fitted (Jeans, Leggings):**
```json
{
  "user_profile": {
    "user_waist_cm": 75,
    "user_hip_cm": 95
  },
  "product_details": {
    "fit_category": "lower_fitted", 
    "product_waist_cm": 76,
    "product_hip_cm": 98
  }
}
```

**Dresses (Complete measurements):**
```json
{
  "user_profile": {
    "user_bust_cm": 88,
    "user_waist_cm": 70,
    "user_hip_cm": 92
  },
  "product_details": {
    "fit_category": "dresses",
    "product_chest_cm": 90,
    "product_waist_cm": 72,
    "product_hip_cm": 94
  }
}
```

### 3.3. Complete Output Schema

#### Success Response (200 OK)

The API returns a JSON object with prediction results and confidence scores.

```json
{
  "predicted_fit": "Perfect Fit",
  "probabilities": {
    "Perfect Fit": 0.85,
    "Slightly Loose": 0.05, 
    "Slightly Tight": 0.08,
    "Very Loose": 0.01,
    "Very Tight": 0.01
  },
  "model_used": "upper_fitted"
}
```

#### Response Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| `predicted_fit` | string | The most likely fit prediction |
| `probabilities` | object | Confidence scores for all possible fits |
| `model_used` | string | Which fit category model was used |

#### Possible Fit Values
- `"Perfect Fit"` - Ideal fit for the user
- `"Slightly Tight"` - May be a bit snug but acceptable
- `"Slightly Loose"` - May be a bit loose but acceptable  
- `"Very Tight"` - Likely too tight, consider size up
- `"Very Loose"` - Likely too loose, consider size down

### 3.4. Error Responses

#### 400 Bad Request - Invalid Fit Category
```json
{
  "detail": "Invalid fit_category. Available models: ['upper_fitted', 'upper_loose', 'lower_fitted', 'lower_loose', 'dresses']"
}
```

#### 422 Unprocessable Entity - Missing Required Field
```json
{
  "detail": "Missing required feature 'user_bust_cm' for category 'upper_fitted'"
}
```

#### 500 Internal Server Error - Prediction Failed
```json
{
  "detail": "Prediction failed: [error details]"
}
```

### 3.5. How to Call the API (Python Example)

Here's a comprehensive example using the `requests` library:

```python
import requests
import json

# The URL of the running ML API service
ML_API_URL = "http://127.0.0.1:8000/predict"

def get_fit_prediction(user_data, product_data):
    """
    Calls the Meesho Smart Fit Prediction API.

    Args:
        user_data (dict): User's measurements
        product_data (dict): Product's category and measurements

    Returns:
        dict: The JSON response from the API, or None if an error occurred
    """
    payload = {
        "user_profile": user_data,
        "product_details": product_data
    }

    try:
        response = requests.post(
            ML_API_URL, 
            json=payload, 
            headers={'Content-Type': 'application/json'},
            timeout=5  # 5-second timeout
        )

        # Check if the request was successful
        response.raise_for_status()
        return response.json()

    except requests.exceptions.HTTPError as e:
        # Handle HTTP errors (4xx, 5xx)
        print(f"HTTP Error {response.status_code}: {response.text}")
        return None
    except requests.exceptions.RequestException as e:
        # Handle network errors
        print(f"Network Error: {e}")
        return None

def get_confidence_level(probabilities, predicted_fit):
    """Helper function to categorize confidence level"""
    confidence = probabilities.get(predicted_fit, 0)
    if confidence >= 0.8:
        return "High"
    elif confidence >= 0.6:
        return "Medium" 
    else:
        return "Low"

# Example usage functions for different categories
def predict_upper_fitted(user_bust, user_waist, product_chest, product_waist):
    """Predict fit for fitted upper garments"""
    user_data = {
        "user_bust_cm": user_bust,
        "user_waist_cm": user_waist
    }
    product_data = {
        "fit_category": "upper_fitted",
        "product_chest_cm": product_chest,
        "product_waist_cm": product_waist
    }
    return get_fit_prediction(user_data, product_data)

def predict_lower_fitted(user_waist, user_hip, product_waist, product_hip):
    """Predict fit for fitted lower garments"""
    user_data = {
        "user_waist_cm": user_waist,
        "user_hip_cm": user_hip
    }
    product_data = {
        "fit_category": "lower_fitted", 
        "product_waist_cm": product_waist,
        "product_hip_cm": product_hip
    }
    return get_fit_prediction(user_data, product_data)

def predict_dress_fit(user_bust, user_waist, user_hip, product_chest, product_waist, product_hip):
    """Predict fit for dresses"""
    user_data = {
        "user_bust_cm": user_bust,
        "user_waist_cm": user_waist,
        "user_hip_cm": user_hip
    }
    product_data = {
        "fit_category": "dresses",
        "product_chest_cm": product_chest,
        "product_waist_cm": product_waist,
        "product_hip_cm": product_hip
    }
    return get_fit_prediction(user_data, product_data)
```

### 3.6. JavaScript/Node.js Integration

#### Using the JavaScript SDK (Recommended)

We provide a comprehensive JavaScript SDK (`meesho-fit-prediction-sdk.js`) for easy integration:

```javascript
// Node.js installation
npm install axios  // Required dependency
const MeeshoFitPredictionAPI = require('./meesho-fit-prediction-sdk');

// Browser usage (include axios and the SDK file)
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="./meesho-fit-prediction-sdk.js"></script>

// Initialize the API client
const api = new MeeshoFitPredictionAPI('http://127.0.0.1:8000');

// Quick examples for different garment types:

// T-shirt prediction
const tshirtResult = await api.predictUpperFitted(91, 78, 92, 80);
console.log(api.generateRecommendationMessage(tshirtResult));

// Jeans prediction  
const jeansResult = await api.predictLowerFitted(75, 95, 76, 98);
console.log(`Fit: ${jeansResult.data.predicted_fit}`);

// Dress prediction
const dressResult = await api.predictDressFit(88, 70, 92, 90, 72, 94);
console.log(`Confidence: ${dressResult.confidence}`);
```

#### Manual Integration (Without SDK)

Here's how to integrate manually using Node.js and axios:

```javascript
const axios = require('axios');

// The URL of the running ML API service
const ML_API_URL = 'http://127.0.0.1:8000/predict';

/**
 * Calls the ML Fit Prediction API
 * @param {Object} userProfile - User's measurements
 * @param {Object} productDetails - Product's category and measurements
 * @returns {Promise<Object|null>} - The API response or null if error occurred
 */
async function getFitPrediction(userProfile, productDetails) {
    const payload = {
        user_profile: userProfile,
        product_details: productDetails
    };

    try {
        const response = await axios.post(ML_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000 // 5-second timeout
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            // API returned an error response
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error: No response from API');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return null;
    }
}

// Example usage
async function main() {
    // 1. Get user measurements from your database
    const currentUserProfile = {
        user_bust_cm: 106,
        user_waist_cm: 88,
        user_hip_cm: 109
    };

    // 2. Get product details from your database
    const viewedProductDetails = {
        fit_category: "upper_loose",
        product_chest_cm: 110
    };

    // 3. Call the API to get the prediction
    const predictionResult = await getFitPrediction(currentUserProfile, viewedProductDetails);

    if (predictionResult) {
        console.log("--- Fit Prediction Received ---");
        console.log(`Predicted Fit: ${predictionResult.predicted_fit}`);
        console.log(`Confidence: ${Math.round(predictionResult.probabilities[predictionResult.predicted_fit] * 100)}%`);
        console.log(`Model Used: ${predictionResult.model_used}`);
        
        // You can now use this result in your application
        // For example, display a message to the user or log analytics
    } else {
        console.log("Failed to get fit prediction");
    }
}

// For Express.js route handler
app.post('/api/get-fit-recommendation', async (req, res) => {
    const { userId, productId } = req.body;
    
    try {
        // Fetch user and product data from your database
        const userProfile = await getUserMeasurements(userId);
        const productDetails = await getProductDetails(productId);
        
        // Get fit prediction
        const fitPrediction = await getFitPrediction(userProfile, productDetails);
        
        if (fitPrediction) {
            res.json({
                success: true,
                prediction: fitPrediction
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to get fit prediction'
            });
        }
    } catch (error) {
        console.error('Error in fit recommendation:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
```

# --- Comprehensive Usage Examples ---

```python
if __name__ == "__main__":
    # Example 1: Upper fitted garment (T-shirt)
    print("=== Example 1: T-shirt Fit Prediction ===")
    result = predict_upper_fitted(
        user_bust=91, user_waist=78,
        product_chest=92, product_waist=80
    )
    
    if result:
        fit = result['predicted_fit']
        confidence = get_confidence_level(result['probabilities'], fit)
        print(f"Predicted Fit: {fit}")
        print(f"Confidence: {confidence}")
        print(f"Probability: {result['probabilities'][fit]:.2%}")
    
    # Example 2: Lower fitted garment (Jeans)
    print("\n=== Example 2: Jeans Fit Prediction ===")
    result = predict_lower_fitted(
        user_waist=75, user_hip=95,
        product_waist=76, product_hip=98
    )
    
    if result:
        fit = result['predicted_fit']
        print(f"Predicted Fit: {fit}")
        print(f"All Probabilities: {result['probabilities']}")
    
    # Example 3: Dress fit prediction
    print("\n=== Example 3: Dress Fit Prediction ===")
    result = predict_dress_fit(
        user_bust=88, user_waist=70, user_hip=92,
        product_chest=90, product_waist=72, product_hip=94
    )
    
    if result:
        fit = result['predicted_fit']
        print(f"Predicted Fit: {fit}")
        print(f"Model Used: {result['model_used']}")
    
    # Example 4: Error handling
    print("\n=== Example 4: Error Handling ===")
    # This will cause an error due to invalid fit_category
    invalid_result = get_fit_prediction(
        {"user_bust_cm": 90}, 
        {"fit_category": "invalid_category"}
    )
    print(f"Result for invalid category: {invalid_result}")

# For Django/Flask Integration
def get_product_fit_recommendation(request):
    """
    Example Django/Flask view function
    """
    try:
        # Extract data from request
        user_id = request.json.get('user_id')
        product_id = request.json.get('product_id')
        
        # Fetch from your database
        user_measurements = get_user_measurements_from_db(user_id)
        product_details = get_product_details_from_db(product_id)
        
        # Get fit prediction
        prediction = get_fit_prediction(user_measurements, product_details)
        
        if prediction:
            return {
                'success': True,
                'fit_prediction': prediction['predicted_fit'],
                'confidence': get_confidence_level(
                    prediction['probabilities'], 
                    prediction['predicted_fit']
                ),
                'recommendation': generate_recommendation_message(prediction)
            }
        else:
            return {'success': False, 'error': 'Failed to get prediction'}
            
    except Exception as e:
        return {'success': False, 'error': str(e)}

def generate_recommendation_message(prediction):
    """Generate user-friendly recommendation message"""
    fit = prediction['predicted_fit']
    confidence = prediction['probabilities'][fit]
    
    if fit == "Perfect Fit" and confidence > 0.8:
        return "This item should fit you perfectly! 👌"
    elif fit == "Slightly Tight":
        return "This might be a bit snug. Consider sizing up for comfort. 📏"
    elif fit == "Slightly Loose":
        return "This might be a bit loose. You could try sizing down. 📐"
    elif fit == "Very Tight":
        return "This will likely be too tight. We recommend going up a size. ⬆️"
    elif fit == "Very Loose":
        return "This will likely be too loose. We recommend going down a size. ⬇️"
    else:
        return f"Predicted fit: {fit}"
```

## 4. Best Practices & Tips

### 4.1. Performance Optimization
- Use connection pooling for high-traffic applications
- Implement caching for frequently requested user/product combinations
- Set appropriate timeouts (recommended: 5 seconds)

### 4.2. Error Handling
- Always check for null/undefined responses
- Log errors for debugging and monitoring
- Provide fallback behavior when API is unavailable

### 4.3. Data Quality
- Validate measurements before sending to API
- Ensure fit_category matches your product catalog
- Store user measurements securely and update regularly

### 4.4. User Experience
- Display confidence levels alongside predictions
- Provide size recommendations based on fit predictions
- Allow users to provide feedback on prediction accuracy

## 5. SDK and Integration Files

### 5.1. Available SDKs
- **JavaScript SDK**: `meesho-fit-prediction-sdk.js` - Works in both Node.js and browser environments
- **Python Examples**: Comprehensive examples provided in this documentation

### 5.2. Required Dependencies
- **JavaScript**: `axios` for HTTP requests
- **Python**: `requests` library

### 5.3. Production Deployment Notes
- Update the base URL from `http://127.0.0.1:8000` to your production API endpoint
- Implement proper authentication if required
- Use HTTPS in production environments
- Consider implementing rate limiting for high-traffic scenarios

---

*This documentation covers the complete integration guide for the Meesho Smart Fit Prediction API. For technical support or feature requests, please contact the development team.*


