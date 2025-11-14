from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from app.predictor import predict_from_csv
from app.taxonomy_handler import get_taxonomy, update_taxonomy

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaxonomyUpdate(BaseModel):
    taxonomy: Dict[str, Any]

@app.get("/")
def root():
    return {"message": "finclassify-prototype backend running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts a CSV file upload, processes it, and returns predictions with summary.
    """
    try:
        contents = await file.read()
        
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(mode='wb', delete=False, suffix='.csv') as tmp_file:
            tmp_file.write(contents)
            tmp_path = tmp_file.name
        
        try:
            predictions, summary = predict_from_csv(tmp_path)
            
            return JSONResponse(content={
                "predictions": predictions,
                "summary": summary
            })
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error processing file: {str(e)}"}
        )

@app.get("/taxonomy")
async def get_taxonomy_endpoint():
    """
    Get the current taxonomy.json file.
    """
    try:
        taxonomy = get_taxonomy()
        return JSONResponse(content=taxonomy)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading taxonomy: {str(e)}")

@app.post("/taxonomy/update")
async def update_taxonomy_endpoint(taxonomy_update: TaxonomyUpdate):
    """
    Update the taxonomy.json file with new data.
    """
    try:
        update_taxonomy(taxonomy_update.taxonomy)
        return JSONResponse(content={"message": "Taxonomy updated successfully"})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating taxonomy: {str(e)}")
