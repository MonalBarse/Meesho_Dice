/**
 * Meesho Smart Fit Prediction API - JavaScript SDK
 * 
 * A simple SDK for integrating with the Meesho Smart Fit Prediction API
 * Supports both Node.js and browser environments
 */

class MeeshoFitPredictionAPI {
    /**
     * Initialize the API client
     * @param {string} baseUrl - The base URL of the API (default: http://127.0.0.1:8000)
     * @param {number} timeout - Request timeout in milliseconds (default: 5000)
     */
    constructor(baseUrl = 'http://127.0.0.1:8000', timeout = 5000) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.timeout = timeout;
        
        // For Node.js environment
        if (typeof require !== 'undefined') {
            this.axios = require('axios');
        }
        // For browser environment, assumes axios is available globally
        else if (typeof axios !== 'undefined') {
            this.axios = axios;
        } else {
            throw new Error('axios is required. Please install axios or include it in your page.');
        }
    }

    /**
     * Check API health and get loaded models
     * @returns {Promise<Object>} Health status and loaded models
     */
    async checkHealth() {
        try {
            const response = await this.axios.get(`${this.baseUrl}/`, {
                timeout: this.timeout
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Get fit prediction for user and product
     * @param {Object} userProfile - User measurements
     * @param {Object} productDetails - Product details and measurements
     * @returns {Promise<Object>} Fit prediction result
     */
    async getFitPrediction(userProfile, productDetails) {
        try {
            const payload = {
                user_profile: userProfile,
                product_details: productDetails
            };

            const response = await this.axios.post(`${this.baseUrl}/predict`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: this.timeout
            });

            return {
                success: true,
                data: response.data,
                confidence: this._getConfidenceLevel(response.data.probabilities, response.data.predicted_fit)
            };
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Predict fit for upper fitted garments (T-shirts, blouses, etc.)
     * @param {number} userBust - User bust measurement in cm
     * @param {number} userWaist - User waist measurement in cm
     * @param {number} productChest - Product chest measurement in cm
     * @param {number} productWaist - Product waist measurement in cm
     * @returns {Promise<Object>} Fit prediction result
     */
    async predictUpperFitted(userBust, userWaist, productChest, productWaist) {
        return this.getFitPrediction(
            {
                user_bust_cm: userBust,
                user_waist_cm: userWaist
            },
            {
                fit_category: 'upper_fitted',
                product_chest_cm: productChest,
                product_waist_cm: productWaist
            }
        );
    }

    /**
     * Predict fit for upper loose garments (Hoodies, oversized shirts, etc.)
     * @param {number} userBust - User bust measurement in cm
     * @param {number} productChest - Product chest measurement in cm
     * @returns {Promise<Object>} Fit prediction result
     */
    async predictUpperLoose(userBust, productChest) {
        return this.getFitPrediction(
            {
                user_bust_cm: userBust
            },
            {
                fit_category: 'upper_loose',
                product_chest_cm: productChest
            }
        );
    }

    /**
     * Predict fit for lower fitted garments (Jeans, leggings, etc.)
     * @param {number} userWaist - User waist measurement in cm
     * @param {number} userHip - User hip measurement in cm
     * @param {number} productWaist - Product waist measurement in cm
     * @param {number} productHip - Product hip measurement in cm
     * @returns {Promise<Object>} Fit prediction result
     */
    async predictLowerFitted(userWaist, userHip, productWaist, productHip) {
        return this.getFitPrediction(
            {
                user_waist_cm: userWaist,
                user_hip_cm: userHip
            },
            {
                fit_category: 'lower_fitted',
                product_waist_cm: productWaist,
                product_hip_cm: productHip
            }
        );
    }

    /**
     * Predict fit for lower loose garments (Joggers, palazzo, etc.)
     * @param {number} userWaist - User waist measurement in cm
     * @param {number} userHip - User hip measurement in cm
     * @param {number} productWaist - Product waist measurement in cm
     * @param {number} productHip - Product hip measurement in cm
     * @returns {Promise<Object>} Fit prediction result
     */
    async predictLowerLoose(userWaist, userHip, productWaist, productHip) {
        return this.getFitPrediction(
            {
                user_waist_cm: userWaist,
                user_hip_cm: userHip
            },
            {
                fit_category: 'lower_loose',
                product_waist_cm: productWaist,
                product_hip_cm: productHip
            }
        );
    }

    /**
     * Predict fit for dresses
     * @param {number} userBust - User bust measurement in cm
     * @param {number} userWaist - User waist measurement in cm
     * @param {number} userHip - User hip measurement in cm
     * @param {number} productChest - Product chest measurement in cm
     * @param {number} productWaist - Product waist measurement in cm
     * @param {number} productHip - Product hip measurement in cm
     * @returns {Promise<Object>} Fit prediction result
     */
    async predictDressFit(userBust, userWaist, userHip, productChest, productWaist, productHip) {
        return this.getFitPrediction(
            {
                user_bust_cm: userBust,
                user_waist_cm: userWaist,
                user_hip_cm: userHip
            },
            {
                fit_category: 'dresses',
                product_chest_cm: productChest,
                product_waist_cm: productWaist,
                product_hip_cm: productHip
            }
        );
    }

    /**
     * Generate user-friendly recommendation message
     * @param {Object} predictionResult - Result from getFitPrediction
     * @returns {string} User-friendly message
     */
    generateRecommendationMessage(predictionResult) {
        if (!predictionResult.success) {
            return "Unable to determine fit. Please check measurements.";
        }

        const fit = predictionResult.data.predicted_fit;
        const confidence = predictionResult.confidence;

        switch (fit) {
            case "Perfect Fit":
                return confidence === "High" ? 
                    "This item should fit you perfectly! 👌" : 
                    "This item looks like a good fit for you! 👍";
            case "Slightly Tight":
                return "This might be a bit snug. Consider sizing up for comfort. 📏";
            case "Slightly Loose":
                return "This might be a bit loose. You could try sizing down. 📐";
            case "Very Tight":
                return "This will likely be too tight. We recommend going up a size. ⬆️";
            case "Very Loose":
                return "This will likely be too loose. We recommend going down a size. ⬇️";
            default:
                return `Predicted fit: ${fit}`;
        }
    }

    /**
     * Get confidence level categorization
     * @private
     */
    _getConfidenceLevel(probabilities, predictedFit) {
        const confidence = probabilities[predictedFit] || 0;
        if (confidence >= 0.8) return "High";
        if (confidence >= 0.6) return "Medium";
        return "Low";
    }

    /**
     * Handle API errors
     * @private
     */
    _handleError(error) {
        if (error.response) {
            // API returned an error response
            return {
                success: false,
                error: {
                    status: error.response.status,
                    message: error.response.data.detail || error.response.data.message || 'API Error',
                    type: 'api_error'
                }
            };
        } else if (error.request) {
            // Request was made but no response received
            return {
                success: false,
                error: {
                    message: 'Network error: Unable to reach API',
                    type: 'network_error'
                }
            };
        } else {
            // Something else happened
            return {
                success: false,
                error: {
                    message: error.message || 'Unknown error occurred',
                    type: 'unknown_error'
                }
            };
        }
    }
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MeeshoFitPredictionAPI;
}

// For browser environments
if (typeof window !== 'undefined') {
    window.MeeshoFitPredictionAPI = MeeshoFitPredictionAPI;
}

// Example usage:
/*
// Node.js
const MeeshoFitPredictionAPI = require('./meesho-fit-prediction-sdk');
const api = new MeeshoFitPredictionAPI();

// Browser
const api = new MeeshoFitPredictionAPI('http://your-api-server.com');

// Check health
const health = await api.checkHealth();
console.log('API Status:', health);

// Get prediction for a T-shirt
const result = await api.predictUpperFitted(91, 78, 92, 80);
if (result.success) {
    console.log('Predicted Fit:', result.data.predicted_fit);
    console.log('Confidence:', result.confidence);
    console.log('Message:', api.generateRecommendationMessage(result));
}
*/