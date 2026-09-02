import pytest
from app.graph.state import TriageState, RiskTier
from app.graph.triage_graph import TriageGraphEngine


@pytest.mark.asyncio
async def test_full_triage_interview_to_completion():
    engine = TriageGraphEngine()
    
    # Step 1: Initial user symptom
    state: TriageState = {
        "session_token": "test-full-001",
        "patient_id": 1,
        "latest_user_input": "I have had a mild tension headache for 2 days.",
        "messages": [
            {"role": "ai", "content": "Hello, please describe your symptoms."},
        ],
        "patient_context": {"chronic_conditions": [], "allergies": []},
    }
    
    step1 = await engine.execute_step(state)
    assert step1["red_flag_detected"] is False
    assert step1["contradiction_detected"] is False
    assert step1["next_question"] is not None
    
    # Step 2: Second user answer
    state["messages"].append({"role": "patient", "content": state["latest_user_input"]})
    state["messages"].append({"role": "ai", "content": step1["next_question"]})
    state["latest_user_input"] = "No fever, just mild tension from computer screens."
    
    # Add third question simulation to reach completion threshold
    state["messages"].append({"role": "ai", "content": "Any vision changes?"})
    state["latest_user_input"] = "No vision changes."
    
    step2 = await engine.execute_step(state)
    assert step2["is_completed"] is True
    assert step2["risk_level"] in [RiskTier.LOW, RiskTier.MEDIUM]
    assert step2["ai_summary"] is not None
    assert step2["recommended_action"] is not None
