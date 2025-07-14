from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Maya LLM Ensemble Service")

class TranslationRequest(BaseModel):
    source_text: str
    source_language: str = "maya"
    target_language: str = "spanish"
    dialect: Optional[str] = None

class TranslationResponse(BaseModel):
    translation: str
    confidence: float
    models_used: List[str]
    consensus_level: float
    complexity_score: float

@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    # --- MOCKUP: Replace with real ensemble pipeline logic ---
    # Here, you would call your LLMs, do voting, etc.
    # For now, return a dummy response
    return TranslationResponse(
        translation=f"[TRADUCTION MOCK] {request.source_text}",
        confidence=0.95,
        models_used=["gpt-4", "claude-3.5", "nllb-200"],
        consensus_level=0.9,
        complexity_score=0.4
    )

@app.get("/health")
async def health():
    return {"status": "ok"}
