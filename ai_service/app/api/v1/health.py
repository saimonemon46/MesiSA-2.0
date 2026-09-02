from fastapi import APIRouter
from app.core.circuit_breaker import CircuitBreakerRegistry
from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "circuit_breakers": CircuitBreakerRegistry.all_status(),
        "safety_thresholds": {
            "ocr_confidence_threshold": settings.OCR_CONFIDENCE_THRESHOLD,
            "circuit_breaker_max_failures": settings.CIRCUIT_BREAKER_MAX_FAILURES,
        }
    }
