from typing import Dict, Any, List
from app.core.config import settings


class OCRService:
    CONFIDENCE_THRESHOLD = settings.OCR_CONFIDENCE_THRESHOLD

    def process_prescription_text(self, raw_text: str, simulated_confidence: float = 0.92) -> Dict[str, Any]:
        medications: List[Dict[str, Any]] = []
        lines = [l.strip() for l in raw_text.splitlines() if l.strip()]

        for line in lines:
            parts = line.split(" - ")
            if len(parts) >= 2:
                medications.append({
                    "name": parts[0].strip(),
                    "dosage": parts[1].strip(),
                    "frequency": parts[2].strip() if len(parts) > 2 else "Daily",
                })

        is_high_confidence = simulated_confidence >= self.CONFIDENCE_THRESHOLD

        return {
            "ocr_status": "completed" if is_high_confidence else "low_confidence",
            "confidence_score": simulated_confidence,
            "threshold_applied": self.CONFIDENCE_THRESHOLD,
            "is_safe_for_clinical_ingestion": is_high_confidence,
            "requires_manual_verification": not is_high_confidence,
            "extracted_data": {
                "medications": medications,
                "raw_line_count": len(lines),
            },
            "warning": None if is_high_confidence else "Low OCR confidence score detected (< 0.85). Human clinician/patient manual confirmation required before clinical reasoning ingestion."
        }
