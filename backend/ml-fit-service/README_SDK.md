# Meesho Smart Fit Prediction API - JavaScript SDK

A comprehensive JavaScript SDK for integrating with the Meesho Smart Fit Prediction API. Works in both Node.js and browser environments.

## Quick Start

### Installation

```bash
# Install required dependency
npm install axios
```

### Basic Usage

```javascript
const MeeshoFitPredictionAPI = require('./meesho-fit-prediction-sdk');

// Initialize the API client
const api = new MeeshoFitPredictionAPI('http://127.0.0.1:8000');

// Check API health
const health = await api.checkHealth();
console.log('API Status:', health.data.status);

// Get fit prediction for a T-shirt
const result = await api.predictUpperFitted(91, 78, 92, 80);
if (result.success) {
    console.log('Predicted Fit:', result.data.predicted_fit);
    console.log('Confidence:', result.confidence);
    console.log('Recommendation:', api.generateRecommendationMessage(result));
}
```

## Available Methods

### Health Check
```javascript
await api.checkHealth()
```

### Fit Prediction Methods
```javascript
// Upper fitted garments (T-shirts, blouses)
await api.predictUpperFitted(userBust, userWaist, productChest, productWaist)

// Upper loose garments (hoodies, oversized shirts)
await api.predictUpperLoose(userBust, productChest)

// Lower fitted garments (jeans, leggings)
await api.predictLowerFitted(userWaist, userHip, productWaist, productHip)

// Lower loose garments (joggers, palazzo)
await api.predictLowerLoose(userWaist, userHip, productWaist, productHip)

// Dresses
await api.predictDressFit(userBust, userWaist, userHip, productChest, productWaist, productHip)

// Generic method
await api.getFitPrediction(userProfile, productDetails)
```

### Utility Methods
```javascript
// Generate user-friendly recommendation
api.generateRecommendationMessage(predictionResult)
```

## Response Format

All prediction methods return:
```javascript
{
    success: true,
    data: {
        predicted_fit: "Perfect Fit",
        probabilities: {
            "Perfect Fit": 0.85,
            "Slightly Loose": 0.05,
            // ...
        },
        model_used: "upper_fitted"
    },
    confidence: "High" // High, Medium, or Low
}
```

## Error Handling

```javascript
const result = await api.predictUpperFitted(91, 78, 92, 80);
if (!result.success) {
    console.error('Error:', result.error.message);
    console.error('Type:', result.error.type);
}
```

## Browser Usage

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="./meesho-fit-prediction-sdk.js"></script>
<script>
    const api = new MeeshoFitPredictionAPI('http://your-api-url.com');
    // Use the same methods as shown above
</script>
```

## Express.js Integration Example

```javascript
const express = require('express');
const MeeshoFitPredictionAPI = require('./meesho-fit-prediction-sdk');

const app = express();
const fitAPI = new MeeshoFitPredictionAPI();

app.post('/api/fit-prediction', async (req, res) => {
    const { userProfile, productDetails } = req.body;
    
    const result = await fitAPI.getFitPrediction(userProfile, productDetails);
    
    if (result.success) {
        res.json({
            fit: result.data.predicted_fit,
            confidence: result.confidence,
            message: fitAPI.generateRecommendationMessage(result)
        });
    } else {
        res.status(500).json({ error: result.error.message });
    }
});
```

## Configuration

```javascript
// Custom configuration
const api = new MeeshoFitPredictionAPI(
    'http://your-api-url.com',  // base URL
    10000                       // timeout in milliseconds
);
```

For complete API documentation, see `API_DOC.md`.