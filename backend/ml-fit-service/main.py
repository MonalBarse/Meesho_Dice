import os
from typing import Dict, Optional

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# --- 1. App and Model Loading ---

# Initialize the FastAPI app
app = FastAPI(
    title="Meesho Scalable Fit Prediction API",
    description="An API that predicts clothing fit based on user and product measurements."
)

# Load all trained models from the 'models' directory into a dictionary on startup
MODELS_DIR = "models"
models = {}
print("Loading models...")
for filename in os.listdir(MODELS_DIR):
    if filename.endswith(".pkl"):
        category = filename.replace("_model.pkl", "")
        models[category] = joblib.load(os.path.join(MODELS_DIR, filename))
        print(f"  - Loaded model for category: '{category}'")

# This is the same configuration from train.py, ensuring consistency
CATEGORY_FEATURES = {
    "upper_fitted": ["user_bust_cm", "user_waist_cm", "product_chest_cm", "product_waist_cm"],
    "upper_loose":  ["user_bust_cm", "product_chest_cm"],
    "lower_fitted": ["user_waist_cm", "user_hip_cm", "product_waist_cm", "product_hip_cm"],
    "lower_loose":  ["user_waist_cm", "user_hip_cm", "product_waist_cm", "product_hip_cm"],
    "dresses":      ["user_bust_cm", "user_waist_cm", "user_hip_cm", "product_chest_cm", "product_waist_cm", "product_hip_cm"]
}

# --- 2. API Data Models (using Pydantic for validation) ---

# All fields are optional because different models need different inputs
class UserProfile(BaseModel):
    user_bust_cm: Optional[float] = None
    user_waist_cm: Optional[float] = None
    user_hip_cm: Optional[float] = None

class ProductDetails(BaseModel):
    fit_category: str = Field(..., description="The fit category, e.g., 'upper_fitted', 'lower_loose'")
    product_chest_cm: Optional[float] = None
    product_waist_cm: Optional[float] = None
    product_hip_cm: Optional[float] = None

class PredictionRequest(BaseModel):
    user_profile: UserProfile
    product_details: ProductDetails

# --- 3. API Endpoints ---

@app.get("/")
def health_check():
    """A simple endpoint to check if the API is running and what models are loaded."""
    return {
        "status": "Healthy",
        "loaded_models": list(models.keys())
    }

@app.post("/predict")
def predict_fit(request: PredictionRequest):
    """
    Main prediction endpoint.
    Takes user and product data, routes to the correct model, and returns a fit prediction.
    """
    category = request.product_details.fit_category

    # 1. Route to the correct model
    if category not in models:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid fit_category. Available models: {list(models.keys())}"
        )
    model = models[category]

    # 2. Select the correct features for the chosen model
    required_features = CATEGORY_FEATURES[category]

    # Combine user and product data into a single dictionary
    data_dict = {**request.user_profile.dict(), **request.product_details.dict()}

    # 3. Validate that all required features for this model are present
    for feature in required_features:
        if data_dict.get(feature) is None:
            raise HTTPException(
                status_code=422, # Unprocessable Entity
                detail=f"Missing required feature '{feature}' for category '{category}'"
            )

    # 4. Prepare the input DataFrame for the model (must be in the correct order)
    input_df = pd.DataFrame([data_dict])[required_features]

    # 5. Make the prediction
    try:
        prediction = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        
        # Format the probabilities into a nice dictionary
        probs_dict = {label: prob for label, prob in zip(model.classes_, probabilities)}

        return {
            "predicted_fit": prediction,
            "probabilities": probs_dict,
            "model_used": category
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
