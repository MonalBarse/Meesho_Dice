import numpy as np
import pandas as pd

# --- CONFIGURATION ---
NUM_SAMPLES = 20000  # Generate a large dataset
FIT_LABELS = ["Very Tight", "Slightly Tight", "Perfect Fit", "Slightly Loose", "Very Loose"]

# Define the master map of every product type to its fit category
PRODUCT_TO_CATEGORY = {
    # Upper Fitted
    "t-shirt": "upper_fitted", "crop top": "upper_fitted", "blouse": "upper_fitted",
    "fitted kurti": "upper_fitted", "tank top": "upper_fitted", "shirt": "upper_fitted",
    # Upper Loose
    "oversized shirt": "upper_loose", "loose kurti": "upper_loose", "poncho": "upper_loose",
    "kaftan": "upper_loose", "hoodie": "upper_loose",
    # Lower Fitted
    "jeans": "lower_fitted", "formal pants": "lower_fitted", "leggings": "lower_fitted",
    "skinny pants": "lower_fitted",
    # Lower Loose
    "joggers": "lower_loose", "palazzo": "lower_loose", "wide-leg pants": "lower_loose",
    # Dresses
    "midi dress": "dresses", "maxi dress": "dresses", "bodycon dress": "dresses"
}

# --- HELPER FUNCTIONS ---

def generate_user_profile():
    """Creates a dictionary representing a user's measurements."""
    return {
        "user_bust_cm": np.random.uniform(75, 125),
        "user_waist_cm": np.random.uniform(60, 115),
        "user_hip_cm": np.random.uniform(85, 135)
    }

def generate_product_and_fit(product_type, user_profile):
    """Generates product measurements and determines the fit based on its category."""
    category = PRODUCT_TO_CATEGORY[product_type]
    product = {"product_type": product_type, "fit_category": category}

    # Simulate product measurements based on user measurements + some noise
    product["product_chest_cm"] = user_profile["user_bust_cm"] + np.random.normal(0, 2.5)
    product["product_waist_cm"] = user_profile["user_waist_cm"] + np.random.normal(0, 2.5)
    product["product_hip_cm"] = user_profile["user_hip_cm"] + np.random.normal(0, 2.5)

    # Determine the fit rating based on the most important measurement for that category
    if category in ["upper_fitted", "upper_loose", "dresses"]:
        diff = user_profile["user_bust_cm"] - product["product_chest_cm"]
    elif category in ["lower_fitted", "lower_loose"]:
        diff = user_profile["user_waist_cm"] - product["product_waist_cm"]
    else: # Default fallback
        diff = 0

    # Define the logic for the 5-point fit scale
    conditions = [
        (diff > 4), (diff > 1.5), (diff < -5), (diff < -2)
    ]
    outputs = ["Very Tight", "Slightly Tight", "Very Loose", "Slightly Loose"]
    product["fit_rating"] = np.select(conditions, outputs, default="Perfect Fit")

    return product

# --- MAIN SCRIPT ---
if __name__ == "__main__":
    all_data = []
    product_types = list(PRODUCT_TO_CATEGORY.keys())

    print("Generating dataset...")
    for i in range(NUM_SAMPLES):
        user = generate_user_profile()
        product_type = np.random.choice(product_types)
        product = generate_product_and_fit(product_type, user)

        # Combine user and product data into a single record
        record = {**user, **product}
        all_data.append(record)
        
        # Simple progress indicator
        if (i + 1) % 2000 == 0:
            print(f"  ...generated {i + 1}/{NUM_SAMPLES} samples")


    # Create a pandas DataFrame and save it to a CSV file
    df = pd.DataFrame(all_data)
    
    # Reorder columns for better readability
    column_order = [
        'fit_category', 'product_type', 'fit_rating', 
        'user_bust_cm', 'user_waist_cm', 'user_hip_cm',
        'product_chest_cm', 'product_waist_cm', 'product_hip_cm'
    ]
    df = df[column_order]
    
    df.to_csv("fit_dataset.csv", index=False)
    print("\nSuccessfully generated fit_dataset.csv")

