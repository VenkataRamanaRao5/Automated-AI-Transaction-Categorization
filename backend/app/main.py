from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from app.predictor import predict_from_csv

app = FastAPI()

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
