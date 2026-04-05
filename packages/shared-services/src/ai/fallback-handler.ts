/**
 * FallbackHandler — Graceful error handling and circuit breaker for LLM calls.
 *
 * Classifies errors, provides user-friendly messages, and implements
 * a circuit breaker to prevent cascading failures.
 */

export type LLMErrorType = "transient" | "quota" | "auth" | "model" | "timeout" | "unknown";

export interface ClassifiedError {
  type: LLMErrorType;
  userMessage: string;
  retryable: boolean;
  originalError: string;
}

export interface CircuitBreakerState {
  failures: number;
  lastFailureAt: number;
  isOpen: boolean;
}

const CIRCUIT_BREAKER_THRESHOLD = 3;
const CIRCUIT_BREAKER_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const CIRCUIT_BREAKER_COOLDOWN_MS = 60 * 1000; // 60 seconds

// Per-tenant circuit breaker state (in-memory, resets on cold start)
const circuitBreakers = new Map<string, CircuitBreakerState>();

/**
 * Classify an LLM error into a known category with a user-friendly message.
 */
export function classifyError(err: unknown): ClassifiedError {
  const message = err instanceof Error ? err.message : String(err);
  const messageLower = message.toLowerCase();

  // Quota / rate limit errors
  if (
    messageLower.includes("429") ||
    messageLower.includes("resource exhausted") ||
    messageLower.includes("quota")
  ) {
    return {
      type: "quota",
      userMessage: "AI service rate limit reached. Please wait a moment and try again.",
      retryable: true,
      originalError: message,
    };
  }

  // Authentication / API key errors
  if (
    messageLower.includes("401") ||
    messageLower.includes("403") ||
    messageLower.includes("invalid api key") ||
    messageLower.includes("permission denied")
  ) {
    return {
      type: "auth",
      userMessage: "AI service configuration error. Please contact your administrator.",
      retryable: false,
      originalError: message,
    };
  }

  // Model errors
  if (
    messageLower.includes("model not found") ||
    messageLower.includes("not supported") ||
    messageLower.includes("deprecated")
  ) {
    return {
      type: "model",
      userMessage: "The AI model is temporarily unavailable. Please try again later.",
      retryable: false,
      originalError: message,
    };
  }

  // Transient server errors (check before timeout so "504 Gateway Timeout" is transient)
  if (
    messageLower.includes("500") ||
    messageLower.includes("502") ||
    messageLower.includes("503") ||
    messageLower.includes("504") ||
    messageLower.includes("overloaded") ||
    messageLower.includes("internal")
  ) {
    return {
      type: "transient",
      userMessage: "AI service is temporarily unavailable. Please try again in a few minutes.",
      retryable: true,
      originalError: message,
    };
  }

  // Timeout
  if (
    messageLower.includes("timeout") ||
    messageLower.includes("deadline exceeded") ||
    messageLower.includes("timed out")
  ) {
    return {
      type: "timeout",
      userMessage: "AI service took too long to respond. Please try again.",
      retryable: true,
      originalError: message,
    };
  }

  return {
    type: "unknown",
    userMessage: "An unexpected error occurred with the AI service. Please try again.",
    retryable: false,
    originalError: message,
  };
}

/**
 * Record a failure for the circuit breaker.
 */
export function recordFailure(tenantId: string): void {
  const now = Date.now();
  const state = circuitBreakers.get(tenantId) ?? { failures: 0, lastFailureAt: 0, isOpen: false };

  // Reset if outside window
  if (now - state.lastFailureAt > CIRCUIT_BREAKER_WINDOW_MS) {
    state.failures = 0;
    state.isOpen = false;
  }

  state.failures++;
  state.lastFailureAt = now;

  if (state.failures >= CIRCUIT_BREAKER_THRESHOLD) {
    state.isOpen = true;
    console.warn(
      `[CircuitBreaker] Circuit opened for tenant ${tenantId} after ${state.failures} failures`
    );
  }

  circuitBreakers.set(tenantId, state);
}

/**
 * Record a success to reset the circuit breaker.
 */
export function recordSuccess(tenantId: string): void {
  const state = circuitBreakers.get(tenantId);
  if (state) {
    state.failures = 0;
    state.isOpen = false;
    circuitBreakers.set(tenantId, state);
  }
}

/**
 * Check if the circuit breaker is open (calls should be blocked).
 */
export function isCircuitOpen(tenantId: string): boolean {
  const state = circuitBreakers.get(tenantId);
  if (!state?.isOpen) return false;

  // Check if cooldown period has passed
  const now = Date.now();
  if (now - state.lastFailureAt > CIRCUIT_BREAKER_COOLDOWN_MS) {
    // Allow a probe request (half-open state)
    state.isOpen = false;
    state.failures = 0;
    circuitBreakers.set(tenantId, state);
    return false;
  }

  return true;
}

/**
 * Get user-friendly error message for a specific error scenario.
 */
export function getQuotaExceededMessage(): string {
  return "AI grading quota reached for this month. Contact your administrator to increase the limit.";
}

/**
 * Get user-friendly error message when circuit breaker is open.
 */
export function getCircuitOpenMessage(): string {
  return "AI service is experiencing issues. Requests are temporarily paused. Please try again in a minute.";
}
