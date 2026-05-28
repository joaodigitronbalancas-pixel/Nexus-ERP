/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnterpriseLogger } from "./logger";

export enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN"
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureThreshold: number;
  private successThreshold: number;
  private cooldownMs: number;
  
  private failures = 0;
  private successes = 0;
  private nextAttemptTime = 0;

  constructor(name: string, failureThreshold = 3, successThreshold = 2, cooldownMs = 15000) {
    this.failureThreshold = failureThreshold;
    this.successThreshold = successThreshold;
    this.cooldownMs = cooldownMs;
  }

  public getState(): CircuitState {
    this.updateState();
    return this.state;
  }

  private updateState() {
    if (this.state === CircuitState.OPEN && Date.now() > this.nextAttemptTime) {
      this.state = CircuitState.HALF_OPEN;
      EnterpriseLogger.warn(`Circuit Breaker transitioned to HALF_OPEN. Testing target availability.`);
    }
  }

  public async execute<T>(fn: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === CircuitState.OPEN) {
      EnterpriseLogger.warn(`Circuit is OPEN. Fast-failing caller and invoking cached local fallback simulator.`);
      return await fallback();
    }

    try {
      const result = await fn();
      
      if (this.state === CircuitState.HALF_OPEN) {
        this.successes++;
        if (this.successes >= this.successThreshold) {
          this.reset();
          EnterpriseLogger.info(`Circuit returned to CLOSED. Target is stable.`);
        }
      }
      return result;
    } catch (error) {
      this.handleFailure(error);
      return await fallback();
    }
  }

  private handleFailure(error: any) {
    this.failures++;
    this.successes = 0;
    
    EnterpriseLogger.error(`Failure occurred inside Circuit Breaker protected block`, undefined, error, {
      failuresCount: this.failures,
      currentState: this.state
    });

    if (this.state === CircuitState.HALF_OPEN || this.failures >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = Date.now() + this.cooldownMs;
      EnterpriseLogger.log(
        "WARN" as any,
        `Circuit Breaker TRIPPED to OPEN. fast-failures will active for next ${this.cooldownMs / 1000}s.`
      );
    }
  }

  private reset() {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
  }
}

// Exponential backoff executor helper
export async function executeWithRetry<T>(
  action: () => Promise<T>,
  retries = 3,
  delayMs = 1000,
  backoffFactor = 2
): Promise<T> {
  let attempt = 1;
  while (true) {
    try {
      return await action();
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }
      const wait = delayMs * Math.pow(backoffFactor, attempt - 1);
      EnterpriseLogger.warn(`Execution with transient error. Retrying attempt #${attempt + 1} of ${retries} in ${wait}ms...`, undefined, { error: String(error) });
      await new Promise(resolve => setTimeout(resolve, wait));
      attempt++;
    }
  }
}
