import os

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# --- CONFIGURATION ---

# This dictionary defines which features are important for each fit category.
# This is the "brain" that tells each model what to focus on.
CATEGORY_FEATURES = {
    "upper_fitted": ["user_bust_cm", "user_waist_cm", "product_chest_cm", "product_waist_cm"],
    "upper_loose":  ["user_bust_cm", "product_chest_cm"],
    "lower_fitted": ["user_waist_cm", "user_hip_cm", "product_waist_cm", "product_hip_cm"],
    "lower_loose":  ["user_waist_cm", "user_hip_cm", "product_waist_cm", "product_hip_cm"],
    "dresses":      ["user_bust_cm", "user_waist_cm", "user_hip_cm", "product_chest_cm", "product_waist_cm", "product_hip_cm"]
}
TARGET_COLUMN = "fit_rating"
DATASET_PATH = "fit_dataset.csv"
MODELS_DIR = "models"

# --- MAIN SCRIPT ---
if __name__ == "__main__":
    # 1. Load the unified dataset
    print(f"Loading dataset from {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)

    # 2. Get the unique fit categories present in the dataset
    fit_categories = df['fit_category'].unique()
    print(f"Found fit categories: {fit_categories}")

    # 3. Loop through each category to train a specialist model
    for category in fit_categories:
        print(f"\n--- Training model for category: '{category}' ---")

        # Ensure this category has a feature definition
        if category not in CATEGORY_FEATURES:
            print(f"Warning: No feature definition for category '{category}'. Skipping.")
            continue

        # Filter data for the current category
        category_df = df[df["fit_category"] == category]
        features = CATEGORY_FEATURES[category]

        # Define features (X) and target (y)
        X = category_df[features]
        y = category_df[TARGET_COLUMN]

        # Initialize the model
        # RandomForest is a great general-purpose model.
        # random_state=42 ensures we get the same result every time we run it.
        model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)

        # Train the model
        print(f"Training with {len(category_df)} samples...")
        model.fit(X, y)

        # Save the trained model artifact to the 'models' directory
        model_filename = os.path.join(MODELS_DIR, f"{category}_model.pkl")
        joblib.dump(model, model_filename)
        print(f"✅ Model saved successfully as {model_filename}")

    print("\nAll models have been trained successfully!")

