from fastapi import APIRouter
from app.api.v1 import triage, ocr, health

api_router = APIRouter()

api_router.include_router(triage.router, prefix="/triage", tags=["AI Triage Reasoning"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["Document OCR Engine"])
api_router.include_router(health.router, tags=["System Health & Circuit Breakers"])
