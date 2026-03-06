from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os


class PredictRequest(BaseModel):
    moisture: int
    temperature: float
    humidity: float


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")


def load_model():
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Model not found at {MODEL_PATH}. Run backend/train.py to create it.")
    return joblib.load(MODEL_PATH)


model = None


@app.on_event("startup")
def startup_event():
    global model
    model = load_model()


@app.post("/predict/dry_next_hour")
def predict(req: PredictRequest):
    global model
    if model is None:
        model = load_model()

    X = [[int(req.moisture), float(req.temperature), float(req.humidity)]]
    proba = model.predict_proba(X)[0]
    # assume class order is [0,1] where 1 == dry
    dry_index = 1
    dry_prob = float(proba[dry_index])
    return {"dry_probability": dry_prob}
