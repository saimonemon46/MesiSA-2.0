from typing import Dict, Any
from app.graph.state import TriageState
from app.graph.nodes.red_flag_node import evaluate_red_flags
from app.graph.nodes.contradiction_node import evaluate_contradictions
from app.graph.nodes.interview_node import conduct_clinical_interview
from app.graph.nodes.synthesis_node import synthesize_clinical_assessment


class TriageGraphEngine:
    async def execute_step(self, state: TriageState) -> TriageState:
        # Step 1: Emergency Red Flag Fast-Path (Rule 12)
        red_flag_res = evaluate_red_flags(state)
        state.update(red_flag_res)
        if state.get("red_flag_detected"):
            return state

        # Step 2: Contradiction Check (Rule 13)
        contradiction_res = evaluate_contradictions(state)
        state.update(contradiction_res)
        if state.get("contradiction_detected"):
            state["next_question"] = state.get("clarification_prompt")
            state["is_completed"] = False
            return state

        # Step 3: Interview or Synthesis
        interview_res = await conduct_clinical_interview(state)
        state.update(interview_res)

        if state.get("is_completed"):
            synthesis_res = await synthesize_clinical_assessment(state)
            state.update(synthesis_res)

        return state
