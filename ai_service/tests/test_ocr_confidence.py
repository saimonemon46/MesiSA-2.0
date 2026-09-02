import pytest
from app.services.ocr_service import OCRService


def test_high_confidence_ocr_allows_clinical_ingestion():
    ocr = OCRService()
    raw_text = """
    Amoxicillin - 500mg - 3 times daily
    Ibuprofen - 400mg - As needed
    """
    
    result = ocr.process_prescription_text(raw_text, simulated_confidence=0.94)
    
    assert result["ocr_status"] == "completed"
    assert result["is_safe_for_clinical_ingestion"] is True
    assert result["requires_manual_verification"] is False
    assert len(result["extracted_data"]["medications"]) == 2
    assert result["extracted_data"]["medications"][0]["name"] == "Amoxicillin"
    assert result["warning"] is None


def test_low_confidence_ocr_blocks_blind_clinical_ingestion():
    # Rule 15: Low-confidence OCR (< 0.85) must not blindly feed into clinical reasoning
    ocr = OCRService()
    blurry_text = """
    Am?xicil??n - 500?g - Daily
    """
    
    result = ocr.process_prescription_text(blurry_text, simulated_confidence=0.72)
    
    assert result["ocr_status"] == "low_confidence"
    assert result["is_safe_for_clinical_ingestion"] is False
    assert result["requires_manual_verification"] is True
    assert result["warning"] is not None
    assert "0.85" in result["warning"]
