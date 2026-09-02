from typing import Dict, Any
from app.graph.state import TriageState, RiskTier
from app.services.llm_provider import LLMProviderService


async def synthesize_clinical_assessment(state: TriageState) -> Dict[str, Any]:
    if state.get("red_flag_detected"):
        return {
            "risk_level": RiskTier.EMERGENCY,
            "is_completed": True,
        }

    llm = LLMProviderService()
    synthesis_prompt = f"""
Synthesize clinical triage outcome for the following patient:
Context: {state.get('patient_context', {})}
Conversation: {state.get('messages', [])}
Latest input: {state.get('latest_user_input', '')}
"""
    result = await llm.synthesize_assessment(synthesis_prompt, state)

    return {
        "risk_level": RiskTier(result.get("risk_tier", "medium")),
        "ai_summary": result.get("summary", "Patient evaluated for acute symptoms. Routine outpatient follow-up recommended."),
        "clinical_assessment": result.get("clinical_assessment", "Non-emergency symptom constellation. Monitor for evolving symptoms."),
        "recommended_action": result.get("recommendations", "Schedule an outpatient consultation with a general physician."),
        "is_completed": True,
        "used_fallback": result.get("used_fallback", False),
    }
