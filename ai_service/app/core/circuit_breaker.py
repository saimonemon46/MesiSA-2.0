import time
from enum import Enum
from typing import Dict, Any


class CircuitState(str, Enum):
    CLOSED = "CLOSED"      # Healthy, operating normally
    OPEN = "OPEN"          # Provider failing, traffic diverted to fallback
    HALF_OPEN = "HALF_OPEN" # Testing recovery


class CircuitBreaker:
    def __init__(self, provider_name: str, failure_threshold: int = 3, reset_timeout: int = 60):
        self.provider_name = provider_name
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.failure_count = 0
        self.last_failure_time = 0.0
        self.state = CircuitState.CLOSED

    def record_success(self) -> None:
        self.failure_count = 0
        self.state = CircuitState.CLOSED

    def record_failure(self) -> None:
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

    def can_execute(self) -> bool:
        if self.state == CircuitState.CLOSED:
            return True
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.reset_timeout:
                self.state = CircuitState.HALF_OPEN
                return True
            return False
        if self.state == CircuitState.HALF_OPEN:
            return True
        return False

    def get_status(self) -> Dict[str, Any]:
        return {
            "provider": self.provider_name,
            "state": self.state.value,
            "failure_count": self.failure_count,
            "threshold": self.failure_threshold,
            "is_available": self.can_execute(),
        }


class CircuitBreakerRegistry:
    _instances: Dict[str, CircuitBreaker] = {}

    @classmethod
    def get(cls, provider_name: str, threshold: int = 3, timeout: int = 60) -> CircuitBreaker:
        if provider_name not in cls._instances:
            cls._instances[provider_name] = CircuitBreaker(provider_name, threshold, timeout)
        return cls._instances[provider_name]

    @classmethod
    def all_status(cls) -> Dict[str, Any]:
        return {name: cb.get_status() for name, cb in cls._instances.items()}
