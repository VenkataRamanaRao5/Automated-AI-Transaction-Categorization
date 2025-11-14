import pandas as pd
from typing import Tuple, List, Dict

def predict_from_csv(csv_path: str) -> Tuple[List[str], Dict]:
    """
    Reads a CSV file and returns dummy predictions along with a summary.
    
    Args:
        csv_path: Path to the CSV file to process
        
    Returns:
        Tuple containing:
        - predictions: List of category predictions (e.g., ["category1", "category2"])
        - summary: Dictionary with summary statistics (e.g., {"total_rows": 10})
    """
    df = pd.read_csv(csv_path)
    predictions = [f"category{i % 3 + 1}" for i in range(len(df))]
    
    # Create summary
    summary = {
        "total_rows": len(df),
        "total_columns": len(df.columns),
        "column_names": df.columns.tolist()
    }
    
    return predictions, summary

