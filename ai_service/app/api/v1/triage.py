from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.graph.state import TriageState
from app.graph.triage_graph import TriageGraphEngine
from app.core.laravel_client import LaravelApiClient

router = APIRouter()
graph_engine = TriageGraphEngine()


class TriageStepRequest(BaseModel):
    session_token: str
    patient_id: int
    user_input: str
    messages: List[Dict[str, str]] = Field(default_factory=list)
    patient_context: Optional[Dict[str, Any]] = None


class TriageStepResponse(BaseModel):
    session_token: str
    reply: Optional[str] = None
    red_flag_detected: bool = False
    contradiction_detected: bool = False
    is_completed: bool = False
    risk_level: str
    ai_summary: Optional[str] = None
    recommended_action: Optional[str] = None
    used_fallback: bool = False


@router.post("/step", response_model=TriageStepResponse)
async def process_triage_step(req: TriageStepRequest):
    patient_context = req.patient_context
    laravel_client = LaravelApiClient()
    
    if not patient_context:
        try:
            patient_context = await laravel_client.get_patient_context(req.patient_id)
        except Exception:
            patient_context = {}

    state: TriageState = {
        "session_token": req.session_token,
        "patient_id": req.patient_id,
        "patient_context": patient_context,
        "messages": req.messages,
        "latest_user_input": req.user_input,
        "red_flag_detected": False,
        "contradiction_detected": False,
        "is_completed": False,
    }

    final_state = await graph_engine.execute_step(state)

    if final_state.get("red_flag_detected"):
        try:
            await laravel_client.report_red_flag(
                session_token=req.session_token,
                red_flag_details=final_state.get("red_flag_details", {}),
                emergency_summary=final_state.get("ai_summary", "Emergency red flag detected."),
            )
        except Exception:
            pass

    if final_state.get("is_completed") and not final_state.get("red_flag_detected"):
        try:
            await laravel_client.complete_triage(
                session_token=req.session_token,
                ai_summary=final_state.get("ai_summary", ""),
                risk_level=str(final_state.get("risk_level", "medium")),
                recommended_action=final_state.get("recommended_action", ""),
                clinical_data={"assessment": final_state.get("clinical_assessment", "")}
            )
        except Exception:
            pass

    return TriageStepResponse(
        session_token=req.session_token,
        reply=final_state.get("next_question"),
        red_flag_detected=final_state.get("red_flag_detected", False),
        contradiction_detected=final_state.get("contradiction_detected", False),
        is_completed=final_state.get("is_completed", False),
        risk_level=str(final_state.get("risk_level", "pending")),
        ai_summary=final_state.get("ai_summary"),
        recommended_action=final_state.get("recommended_action"),
        used_fallback=final_state.get("used_fallback", False),
    )
