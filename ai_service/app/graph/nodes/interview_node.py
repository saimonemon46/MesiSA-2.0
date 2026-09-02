from typing import Dict, Any
from app.graph.state import TriageState
from app.services.llm_provider import LLMProviderService


async def conduct_clinical_interview(state: TriageState) -> Dict[str, Any]:
    llm = LLMProviderService()
    ai_questions_count = len([m for m in state.get("messages", []) if m.get("role") == "ai"])
    
    prompt = f"""
You are MediSA AI, a supportive clinical triage assistant.
Patient context: {state.get('patient_context', {})}
Patient's input: {state.get('latest_user_input', '')}
Previous conversation: {state.get('messages', [])}
"""
    result = await llm.generate_triage_step(prompt, state)
    
    if result.get("is_sufficient") or ai_questions_count >= 3:
        return {
            "is_completed": True,
            "next_question": None,
            "used_fallback": result.get("used_fallback", False),
        }
    
    return {
        "is_completed": False,
        "next_question": result.get("reply", "Could you describe when these symptoms first started and if anything makes them better or worse?"),
        "used_fallback": result.get("used_fallback", False),
    }
