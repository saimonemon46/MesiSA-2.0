import pytest
from app.graph.state import TriageState
from app.graph.triage_graph import TriageGraphEngine


@pytest.mark.asyncio
async def test_medical_history_contradiction_triggers_clarification():
    state: TriageState = {
        "session_token": "test-contra-001",
        "patient_id": 1,
        "patient_context": {
            "chronic_conditions": ["Hypertension (Stage 1)"],
            "allergies": [],
        },
        "latest_user_input": "I have no medical history or previous conditions.",
        "messages": [],
    }
    
    engine = TriageGraphEngine()
    result = await engine.execute_step(state)
    
    assert result["contradiction_detected"] is True
    assert result["is_completed"] is False
    assert "hypertension" in result["contradiction_reason"].lower()
    assert "clarify" in result["next_question"].lower()


@pytest.mark.asyncio
async def test_pain_scale_contradiction_triggers_clarification():
    state: TriageState = {
        "session_token": "test-contra-002",
        "patient_id": 1,
        "patient_context": {},
        "latest_user_input": "Actually I have no pain at all.",
        "messages": [
            {"role": "patient", "content": "I am experiencing severe pain 10/10 in my lower abdomen."},
            {"role": "ai", "content": "How long has this severe pain lasted?"},
        ],
    }
    
    engine = TriageGraphEngine()
    result = await engine.execute_step(state)
    
    assert result["contradiction_detected"] is True
    assert result["is_completed"] is False
    assert "severe pain" in result["contradiction_reason"].lower()
