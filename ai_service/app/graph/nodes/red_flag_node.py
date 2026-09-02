from typing import Dict, Any
from app.graph.state import TriageState, RiskTier

RED_FLAG_PATTERNS = [
    {"keyword": "chest pain", "associated": ["left arm", "jaw", "shortness of breath", "sweating", "crushing", "pressure"], "condition": "Acute Coronary Syndrome / Myocardial Infarction"},
    {"keyword": "sudden weakness", "associated": ["face drooping", "arm weakness", "speech difficulty", "slurred speech", "numbness one side"], "condition": "Acute Stroke (FAST alert)"},
    {"keyword": "cannot breathe", "associated": ["gasping", "blue lips", "suffocating", "severe asthma attack"], "condition": "Acute Respiratory Distress"},
    {"keyword": "severe allergic", "associated": ["throat swelling", "difficulty breathing", "tongue swollen", "anaphylaxis"], "condition": "Anaphylactic Shock"},
    {"keyword": "coughing blood", "associated": ["large amount", "massive hemorrhage"], "condition": "Severe Pulmonary Hemorrhage"},
    {"keyword": "unconscious", "associated": ["unresponsive", "passed out", "fainted with trauma"], "condition": "Loss of Consciousness"},
    {"keyword": "worst headache", "associated": ["thunderclap", "sudden explosion", "stiff neck with fever"], "condition": "Subarachnoid Hemorrhage / Meningitis"},
]


def evaluate_red_flags(state: TriageState) -> Dict[str, Any]:
    text = (state.get("latest_user_input") or "").lower()
    for msg in state.get("messages", []):
        if msg.get("role") == "patient":
            text += " " + msg.get("content", "").lower()

    for pattern in RED_FLAG_PATTERNS:
        kw = pattern["keyword"]
        if kw in text:
            matched_mods = [mod for mod in pattern["associated"] if mod in text]
            if matched_mods or kw in ["cannot breathe", "unconscious", "severe allergic"]:
                return {
                    "red_flag_detected": True,
                    "red_flag_details": {
                        "primary_flag": kw,
                        "matched_indicators": matched_mods or [kw],
                        "suspected_emergency": pattern["condition"],
                    },
                    "risk_level": RiskTier.EMERGENCY,
                    "ai_summary": f"CRITICAL EMERGENCY DETECTED: {pattern['condition']}. Patient reported {kw} with {matched_mods}.",
                    "recommended_action": "Seek immediate emergency medical attention or call 911/emergency dispatch right away.",
                    "clinical_assessment": "Immediate life threat potential. Conversational triage terminated per Emergency Protocol.",
                    "is_completed": True,
                }

    return {
        "red_flag_detected": False,
        "red_flag_details": None,
        "risk_level": state.get("risk_level", RiskTier.PENDING),
    }
