from typing import Dict, Any
from app.graph.state import TriageState, RiskTier


def deterministic_safe_fallback(state: TriageState) -> Dict[str, Any]:
    return {
        "risk_level": RiskTier.MEDIUM,
        "ai_summary": "Automated clinical safety notice: Our AI reasoning provider is currently undergoing routine maintenance. Your symptoms have been recorded.",
        "clinical_assessment": "Standard non-deterministic evaluation was redirected to conservative clinical safety guidelines.",
        "recommended_action": "Please contact your primary care doctor or visit an urgent care center for comprehensive physical examination.",
        "is_completed": True,
        "used_fallback": True,
    }
