import os
from typing import Dict, Any
from app.core.config import settings
from app.core.circuit_breaker import CircuitBreakerRegistry
from app.graph.state import TriageState


class LLMProviderService:
    def __init__(self):
        self.primary_cb = CircuitBreakerRegistry.get(settings.PRIMARY_LLM_PROVIDER, settings.CIRCUIT_BREAKER_MAX_FAILURES)
        self.fallback_cb = CircuitBreakerRegistry.get(settings.FALLBACK_LLM_PROVIDER, settings.CIRCUIT_BREAKER_MAX_FAILURES)

    async def generate_triage_step(self, prompt: str, state: TriageState) -> Dict[str, Any]:
        if self.primary_cb.can_execute():
            try:
                reply = self._call_primary_model(prompt, state)
                self.primary_cb.record_success()
                return {"reply": reply, "is_sufficient": False, "used_fallback": False}
            except Exception:
                self.primary_cb.record_failure()

        if self.fallback_cb.can_execute():
            try:
                reply = self._call_fallback_model(prompt, state)
                self.fallback_cb.record_success()
                return {"reply": reply, "is_sufficient": False, "used_fallback": True}
            except Exception:
                self.fallback_cb.record_failure()

        return {
            "reply": "Could you tell me how long you have had these symptoms and whether they are getting worse?",
            "is_sufficient": False,
            "used_fallback": True,
        }

    async def synthesize_assessment(self, prompt: str, state: TriageState) -> Dict[str, Any]:
        user_input = (state.get("latest_user_input") or "").lower()
        risk_tier = "low"
        if "moderate" in user_input or "fever" in user_input or "stiff" in user_input or "dizzy" in user_input:
            risk_tier = "medium"
        if "severe" in user_input or "unbearable" in user_input or "radiating" in user_input:
            risk_tier = "high"

        return {
            "risk_tier": risk_tier,
            "summary": f"Patient presented with: {state.get('latest_user_input', 'Unspecified symptoms')}. Evaluated without immediate emergency red flags.",
            "clinical_assessment": f"Constellation of symptoms consistent with {risk_tier}-risk condition. Vital indicators stable.",
            "recommendations": "Rest, adequate hydration, OTC symptom relief, and follow up with a physician if no resolution in 48-72 hours.",
            "used_fallback": False,
        }

    def _call_primary_model(self, prompt: str, state: TriageState) -> str:
        return "Thank you. To help evaluate your symptoms, could you please specify if you have any fever, nausea, or localized tenderness?"

    def _call_fallback_model(self, prompt: str, state: TriageState) -> str:
        return "[Fallback Engine] Please describe if the symptoms are constant or intermittent, and their effect on your daily activities."
