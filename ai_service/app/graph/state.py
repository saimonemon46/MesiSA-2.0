from typing import TypedDict, List, Dict, Any, Optional
from enum import Enum


class RiskTier(str, Enum):
    EMERGENCY = "emergency"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    PENDING = "pending"


class Message(TypedDict):
    role: str # "patient", "ai", "system"
    content: str


class TriageState(TypedDict, total=False):
    # Session & Patient info
    session_token: str
    patient_id: int
    patient_context: Dict[str, Any]
    
    # Conversation tracking
    messages: List[Message]
    latest_user_input: str
    
    # Clinical slots extracted
    primary_symptoms: List[str]
    symptom_duration: Optional[str]
    symptom_severity: Optional[str] # mild, moderate, severe
    associated_symptoms: List[str]
    
    # Safety gates
    red_flag_detected: bool
    red_flag_details: Optional[Dict[str, Any]]
    contradiction_detected: bool
    contradiction_reason: Optional[str]
    clarification_prompt: Optional[str]
    
    # Outcomes
    risk_level: RiskTier
    ai_summary: Optional[str]
    recommended_action: Optional[str]
    clinical_assessment: Optional[str]
    next_question: Optional[str]
    is_completed: bool
    used_fallback: bool
