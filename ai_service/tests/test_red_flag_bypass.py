import pytest
from app.graph.state import TriageState, RiskTier
from app.graph.triage_graph import TriageGraphEngine


@pytest.mark.asyncio
async def test_chest_pain_with_radiation_triggers_immediate_emergency():
    state: TriageState = {
        "session_token": "test-emg-001",
        "patient_id": 1,
        "latest_user_input": "I have sudden severe crushing chest pain radiating to my left arm and jaw.",
        "messages": [],
        "patient_context": {},
    }
    
    engine = TriageGraphEngine()
    result = await engine.execute_step(state)
    
    assert result["red_flag_detected"] is True
    assert result["risk_level"] == RiskTier.EMERGENCY
    assert result["is_completed"] is True
    assert "CRITICAL EMERGENCY" in result["ai_summary"]
    assert "Acute Coronary Syndrome" in str(result["red_flag_details"])


@pytest.mark.asyncio
async def test_stroke_fast_symptoms_trigger_immediate_emergency():
    state: TriageState = {
        "session_token": "test-emg-002",
        "patient_id": 1,
        "latest_user_input": "My right arm is weak and I have sudden weakness with slurred speech.",
        "messages": [],
        "patient_context": {},
    }
    
    engine = TriageGraphEngine()
    result = await engine.execute_step(state)
    
    assert result["red_flag_detected"] is True
    assert result["risk_level"] == RiskTier.EMERGENCY
    assert result["is_completed"] is True
    assert "Stroke" in str(result["red_flag_details"])


@pytest.mark.asyncio
async def test_routine_symptoms_do_not_trigger_red_flag():
    state: TriageState = {
        "session_token": "test-routine-001",
        "patient_id": 1,
        "latest_user_input": "I have had a mild runny nose and sneezing for 3 days.",
        "messages": [],
        "patient_context": {},
    }
    
    engine = TriageGraphEngine()
    result = await engine.execute_step(state)
    
    assert result["red_flag_detected"] is False
    assert result["risk_level"] != RiskTier.EMERGENCY
