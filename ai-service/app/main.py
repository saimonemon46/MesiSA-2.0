import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="MediSA AI Service",
    description="Federated RAG and Medical Knowledge Retrieval Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    database_host: str

@app.get("/healthz", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        service="medisa-ai-service",
        version="1.0.0",
        database_host=os.getenv("DB_HOST", "medisa-db")
    )

@app.get("/")
def root():
    return {
        "message": "Welcome to MediSA AI Service (FRAG & Traditional RAG engine)",
        "docs": "/docs"
    }
