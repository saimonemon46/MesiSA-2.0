from typing import Dict, Any
from app.graph.state import TriageState


def evaluate_contradictions(state: TriageState) -> Dict[str, Any]:
    user_input = (state.get("latest_user_input") or "").lower()
    patient_context = state.get("patient_context") or {}
    chronic_conditions = [c.lower() for c in patient_context.get("chronic_conditions", [])]
    allergies = [a.lower() for a in patient_context.get("allergies", [])]
    
    if "no medical history" in user_input or "no previous conditions" in user_input or "never had health issues" in user_input:
        if chronic_conditions:
            return {
                "contradiction_detected": True,
                "contradiction_reason": f"Patient stated no prior history, but medical record lists chronic condition(s): {', '.join(chronic_conditions)}.",
                "clarification_prompt": f"To ensure accurate triage: your medical profile notes a history of {', '.join(chronic_conditions)}. Could you clarify if this is related to your current symptoms?",
            }

    if "no allergies" in user_input or "not allergic to anything" in user_input:
        if allergies:
            return {
                "contradiction_detected": True,
                "contradiction_reason": f"Patient stated no allergies, but record lists known allergy to {', '.join(allergies)}.",
                "clarification_prompt": f"Your record mentions an allergy to {', '.join(allergies)}. Please confirm if you are experiencing any reaction related to this.",
            }

    past_patient_msgs = [m.get("content", "").lower() for m in state.get("messages", []) if m.get("role") == "patient"]
    past_text = " ".join(past_patient_msgs)
    
    if ("severe pain" in past_text or "10/10" in past_text) and ("no pain at all" in user_input or "it doesn't hurt" in user_input):
        return {
            "contradiction_detected": True,
            "contradiction_reason": "Patient previously reported severe pain, but now states no pain at all.",
            "clarification_prompt": "Earlier you mentioned experiencing severe pain, but just noted no pain. Could you clarify if the pain has completely resolved, or if it changes with movement?",
        }

    return {
        "contradiction_detected": False,
        "contradiction_reason": None,
        "clarification_prompt": None,
    }
