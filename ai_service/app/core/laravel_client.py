import httpx
from typing import Dict, Any, Optional
from app.core.config import settings


class LaravelApiClient:
    """
    Controlled internal API client communicating with Laravel backend.
    Enforces Rule 5 (No direct SQL access) & Rule 6 (Controlled API tools).
    """

    def __init__(self, base_url: Optional[str] = None, secret: Optional[str] = None):
        self.base_url = (base_url or settings.LARAVEL_API_BASE_URL).rstrip('/')
        self.secret = secret or settings.INTERNAL_AI_SECRET

    def _headers(self) -> Dict[str, str]:
        return {
            "X-Internal-Secret": self.secret,
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

    async def get_patient_context(self, patient_id: int) -> Dict[str, Any]:
        url = f"{self.base_url}/internal/patient-context/{patient_id}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers=self._headers())
            resp.raise_for_status()
            return resp.json().get("data", {})

    async def report_red_flag(self, session_token: str, red_flag_details: Dict[str, Any], emergency_summary: str) -> Dict[str, Any]:
        url = f"{self.base_url}/internal/triage/red-flag"
        payload = {
            "session_token": session_token,
            "red_flag_details": red_flag_details,
            "emergency_summary": emergency_summary,
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload, headers=self._headers())
            resp.raise_for_status()
            return resp.json()

    async def complete_triage(
        self,
        session_token: str,
        ai_summary: str,
        risk_level: str,
        recommended_action: str,
        clinical_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        url = f"{self.base_url}/internal/triage/complete"
        payload = {
            "session_token": session_token,
            "ai_summary": ai_summary,
            "risk_level": risk_level,
            "recommended_action": recommended_action,
            "clinical_data": clinical_data or {},
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload, headers=self._headers())
            resp.raise_for_status()
            return resp.json()
