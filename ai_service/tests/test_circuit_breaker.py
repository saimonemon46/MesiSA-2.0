import pytest
from app.core.circuit_breaker import CircuitBreaker, CircuitState, CircuitBreakerRegistry
from app.services.llm_provider import LLMProviderService


def test_circuit_breaker_state_transitions():
    cb = CircuitBreaker("test_provider", failure_threshold=3, reset_timeout=1)
    
    assert cb.state == CircuitState.CLOSED
    assert cb.can_execute() is True
    
    cb.record_failure()
    assert cb.state == CircuitState.CLOSED
    assert cb.failure_count == 1
    
    cb.record_failure()
    assert cb.state == CircuitState.CLOSED
    assert cb.failure_count == 2
    
    # 3rd failure opens circuit
    cb.record_failure()
    assert cb.state == CircuitState.OPEN
    assert cb.can_execute() is False
    
    # Success resets circuit
    cb.record_success()
    assert cb.state == CircuitState.CLOSED
    assert cb.failure_count == 0


@pytest.mark.asyncio
async def test_llm_provider_fallback_when_primary_fails():
    service = LLMProviderService()
    
    # Trip primary circuit breaker
    service.primary_cb.record_failure()
    service.primary_cb.record_failure()
    service.primary_cb.record_failure()
    assert service.primary_cb.state == CircuitState.OPEN
    
    # Call should succeed by routing to fallback
    result = await service.generate_triage_step("Test prompt", {"messages": []})
    assert result["used_fallback"] is True
    assert result["reply"] is not None
