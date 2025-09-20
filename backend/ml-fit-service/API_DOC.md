## 1. Overview

This service provides a real-time, personalized clothing fit prediction for Meesho customers. It is built as a standalone microservice that can be called by the main backend.

The core challenge it solves is **product uncertainty**, which is a primary driver of high return rates. By providing a reliable fit prediction, we aim to increase customer confidence, boost conversion rates, and significantly reduce operational costs associated with returns.

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

## 3. Integration Guide (For the Main Backend Developer)

This section provides all the details needed to integrate and use the Fit Prediction API from the main backend service.

### 3.1. API Endpoint

- **URL:** `http://127.0.0.1:8000/predict`
- **Method:** `POST`
- **Content-Type:** `application/json`

### 3.2. Request Body (API Contract)

The API expects a JSON object with two main keys: `user_profile` and `product_details`. All measurement fields are optional, but you must provide the ones required by the product's `fit_category`.

**Example Request Payload:**

```json
{
  "user_profile": {
    "user_bust_cm": 91,
    "user_waist_cm": 78,
    "user_hip_cm": 99
  },
  "product_details": {
    "fit_category": "upper_fitted",
    "product_chest_cm": 92,
    "product_waist_cm": 80
  }
}
```

### 3.3. Success Response (200 OK)

If the request is successful, the API will return a JSON object containing the prediction and confidence scores.

**Example Success Response:**

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

### 3.4. Error Responses

- `400 Bad Request`: If the `fit_category` is invalid.
- `422 Unprocessable Entity`: If a required measurement for a given category is missing from the request.

### 3.5. How to Call the API (Example in Python)

Here is a simple example of how the main backend can call this service using the `requests` library.

```python
import requests
import json

# The URL of the running ML API service
ML_API_URL = "[http://127.0.0.1:8000/predict](http://127.0.0.1:8000/predict)"

def get_fit_prediction(user_data, product_data):
    """
    Calls the ML Fit Prediction API.

    Args:
        user_data (dict): A dictionary with the user's measurements.
        product_data (dict): A dictionary with the product's category and measurements.

    Returns:
        dict: The JSON response from the API, or None if an error occurred.
    """
    payload = {
        "user_profile": user_data,
        "product_details": product_data
    }

    try:
        response = requests.post(ML_API_URL, json=payload, timeout=2) # 2-second timeout

        # Check if the request was successful
        response.raise_for_status()

        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Error calling ML API: {e}")
        return None
```

# --- Example Usage ---

```
if __name__ == "__main__":
    # 1. Get user measurements from your database
    current_user_profile = {
        "user_bust_cm": 106,
        "user_waist_cm": 88,
        "user_hip_cm": 109
    }

    # 2. Get product details from your database for the item the user is viewing
    viewed_product_details = {
        "fit_category": "upper_loose", # This info needs to be stored with the product
        "product_chest_cm": 110
    }

    # 3. Call the API to get the prediction
    prediction_result = get_fit_prediction(current_user_profile, viewed_product_details)

    if prediction_result:
        print("--- Fit Prediction Received ---")
        print(f"Predicted Fit: {prediction_result.get('predicted_fit')}")
        print(f"Probabilities: {prediction_result.get('probabilities')}")

        # Now you can use this result to display a message on the frontend.
```

---

### ## Step 3: Commit and Push to GitHub

You're all set. The code is organized, and the documentation is written. The final step is to add these changes to your GitHub repository.

1.  **Navigate to the root of your project folder** (the one with `.git`).
2.  **Add all your changes:**
    ```bash
    git add .
    ```
3.  **Commit the changes with a clear message:**
    ```bash
    git commit -m "feat: Add scalable ML fit prediction service and documentation"
    ```
4.  **Push the changes to your repository:**
    ```bash
    git push
    ```

You have now successfully integrated the ML service into your project and provided excellent documentation for your team.

```

```
