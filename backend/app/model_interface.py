from typing import List, Any
import os
import torch
import pickle
from transformers import BertTokenizer, BertForSequenceClassification
from torch.functional import F

class ModelInterface:
    """
    Placeholder class for future ML model integration.
    This class will be used to load and interact with trained models.
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the model interface.
        
        Args:
            model_path: Path to the saved model file (e.g., "models/model.pkl")
        """
        self.model_path = model_path or os.getenv("MODEL_PATH", "bert-category-model")
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = BertForSequenceClassification.from_pretrained(self.model_path).to(self.device)
        self.tokenizer = BertTokenizer.from_pretrained(self.model_path)
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        with open('label_encoder.pkl', 'rb') as f:
            self.label_encoder = pickle.load(f)

        self.loaded = False
    
    def predict(self, data: Any, max_len=128) -> List[str]:
        """
        Make predictions on the provided data.
        
        Args:
            data: Input data for prediction (format depends on model)
            
        Returns:
            List of predictions
        """
        self.model.eval()
        encoding = self.tokenizer.encode_plus(
            data,
            add_special_tokens=True,
            max_length=max_len,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        input_ids = encoding['input_ids'].to(self.device)
        attention_mask = encoding['attention_mask'].to(self.device)

        with torch.no_grad():
            outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits
            probs = F.softmax(logits, dim=1)
            conf_score, pred_idx = torch.max(probs, dim=1)
            pred_label = self.label_encoder.inverse_transform([pred_idx.item()])[0]
        return [pred_label, conf_score.item()]
    
    def predict_batch(self, data_list: List[Any]) -> List[str]:
        """
        Make predictions on a batch of data.
        
        Args:
            data_list: List of input data for prediction
            
        Returns:
            List of predictions
        """
        return [self.predict(data) for data in data_list]

