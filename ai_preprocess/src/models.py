import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

MODEL_NAME = 'distilbert-base-uncased-finetuned-sst-2-english'

def load_model():
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
    model.eval()
    return SentimentScorer(tokenizer, model)

class SentimentScorer:
    def __init__(self, tokenizer, model):
        self.tokenizer = tokenizer
        self.model = model

    def score(self, payload: bytes) -> float:
        text = payload.decode('utf-8', errors='ignore')
        inputs = self.tokenizer(text, return_tensors='pt')
        with torch.no_grad():
            out = self.model(**inputs)
            prob = torch.softmax(out.logits, dim=-1)[0,1].item()
        return prob
