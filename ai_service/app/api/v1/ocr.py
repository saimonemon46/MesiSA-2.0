from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.ocr_service import OCRService

router = APIRouter()
ocr_service = OCRService()


class OCRProcessRequest(BaseModel):
    raw_ocr_text: str
    confidence_score: float = 0.90


class OCRProcessResponse(BaseModel):
    ocr_status: str
    confidence_score: float
    threshold_applied: float
    is_safe_for_clinical_ingestion: bool
    requires_manual_verification: bool
    extracted_data: Dict[str, Any]
    warning: Optional[str] = None


@router.post("/process", response_model=OCRProcessResponse)
async def process_document_ocr(req: OCRProcessRequest):
    result = ocr_service.process_prescription_text(req.raw_ocr_text, req.confidence_score)
    return OCRProcessResponse(**result)
