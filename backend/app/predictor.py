import pandas as pd
from typing import Tuple, List, Dict, Any

def predict_from_csv(csv_path: str) -> Tuple[List[Dict[str, Any]], Dict]:
    """
    Reads a CSV file and returns dummy predictions along with a summary.
    
    Args:
        csv_path: Path to the CSV file to process
        
    Returns:
        Tuple containing:
        - predictions: List of prediction objects with category and explanation
        - summary: Dictionary with summary statistics (e.g., {"total_rows": 10})
    """
    df = pd.read_csv(csv_path)
    
    # Mock explanation data based on category
    explanation_templates = {
        "category1": {
            "tokens": ["amazon", "purchase"],
            "rule_triggered": "shopping_rule",
            "nearest_merchants": ["Amazon", "Flipkart", "Ebay"]
        },
        "category2": {
            "tokens": ["petrol", "fuel", "station"],
            "rule_triggered": "fuel_rule",
            "nearest_merchants": ["BP", "Shell", "Indian Oil"]
        },
        "category3": {
            "tokens": ["restaurant", "food", "dining"],
            "rule_triggered": "food_rule",
            "nearest_merchants": ["McDonald's", "KFC", "Domino's"]
        }
    }
    
    # Generate predictions with explanations
    predictions = []
    for i in range(len(df)):
        category = f"category{i % 3 + 1}"
        explanation = explanation_templates[category].copy()
        
        predictions.append({
            "category": category,
            "explanation": explanation
        })
    
    # Create summary
    summary = {
        "total_rows": len(df),
        "total_columns": len(df.columns),
        "column_names": df.columns.tolist()
    }
    
    return predictions, summary

