import json
import os
from typing import Dict, Any
from pathlib import Path

# Get the path to the data directory (assuming it's at the project root)
BASE_DIR = Path(__file__).parent.parent.parent
TAXONOMY_PATH = BASE_DIR / "data" / "taxonomy.json"

def get_taxonomy() -> Dict[str, Any]:
    """
    Read and return the taxonomy.json file.
    
    Returns:
        Dictionary containing taxonomy data
    """
    try:
        if TAXONOMY_PATH.exists():
            with open(TAXONOMY_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            # Return default empty taxonomy structure
            return {}
    except (json.JSONDecodeError, IOError) as e:
        raise ValueError(f"Error reading taxonomy file: {str(e)}")

def update_taxonomy(taxonomy_data: Dict[str, Any]) -> bool:
    """
    Update the taxonomy.json file with new data.
    
    Args:
        taxonomy_data: Dictionary containing taxonomy data to save
        
    Returns:
        True if successful, raises exception otherwise
    """
    try:
        # Ensure the data directory exists
        TAXONOMY_PATH.parent.mkdir(parents=True, exist_ok=True)
        
        # Validate that it's a dictionary
        if not isinstance(taxonomy_data, dict):
            raise ValueError("Taxonomy data must be a dictionary")
        
        # Write to file
        with open(TAXONOMY_PATH, 'w', encoding='utf-8') as f:
            json.dump(taxonomy_data, f, indent=2, ensure_ascii=False)
        
        return True
    except (IOError, TypeError) as e:
        raise ValueError(f"Error writing taxonomy file: {str(e)}")

