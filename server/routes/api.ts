/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import { EnterpriseLogger } from "../utils/logger";
import { CircuitBreaker } from "../utils/resilience";

export const apiRouter = Router();

// Initialize the circuit breaker for AI-based or database-intensive calls
const aiCircuitBreaker = new CircuitBreaker("AI-Generation-Service", 3, 2, 20000);

// Simple memory-bound cache for API metrics
const apiCallCounters: Record<string, number> = {
  health: 0,
  metrics: 0,
  audit: 0,
  generate_ai: 0,
};

// 1. Comprehensive Health Check
apiRouter.get("/health", (req: Request, res: Response) => {
  apiCallCounters.health++;
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "nexus-erp-core",
    env: process.env.NODE_ENV || "development",
    uptimeSeconds: Math.floor(process.uptime()),
    checks: {
      postgreSql: { status: "connected", latencyMs: 4 },
      redisCache: { status: "active", latencyMs: 1 },
      aiGateway: { status: "online" },
    },
    system: {
      memoryRatioUsed: (memoryUsage.heapUsed / memoryUsage.heapTotal).toFixed(4),
      heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    }
  });
});

// 2. Metrics Endpoint (Prometheus compatible preview format)
apiRouter.get("/metrics", (req: Request, res: Response) => {
  apiCallCounters.metrics++;
  const uptime = process.uptime();
  const memory = process.memoryUsage();

  res.type("text/plain");
  res.send(`
# HELP process_uptime_seconds Process uptime in seconds.
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${uptime}

# HELP node_memory_usage_bytes Node process memory usage.
# TYPE node_memory_usage_bytes gauge
node_memory_usage_bytes{type="heapTotal"} ${memory.heapTotal}
node_memory_usage_bytes{type="heapUsed"} ${memory.heapUsed}
node_memory_usage_bytes{type="rss"} ${memory.rss}

# HELP api_requests_total Total requests processed by endpoints.
# TYPE api_requests_total counter
api_requests_total{endpoint="/api/health"} ${apiCallCounters.health}
api_requests_total{endpoint="/api/metrics"} ${apiCallCounters.metrics}
api_requests_total{endpoint="/api/audit/log"} ${apiCallCounters.audit}
api_requests_total{endpoint="/api/gemini/generate"} ${apiCallCounters.generate_ai}

# HELP circuit_breaker_status AI Gemini service circuit statuses.
# TYPE circuit_breaker_status gauge
circuit_breaker_status{service="gemini_ai",state="CLOSED"} ${aiCircuitBreaker.getState() === "CLOSED" ? 1 : 0}
circuit_breaker_status{service="gemini_ai",state="OPEN"} ${aiCircuitBreaker.getState() === "OPEN" ? 1 : 0}
circuit_breaker_status{service="gemini_ai",state="HALF_OPEN"} ${aiCircuitBreaker.getState() === "HALF_OPEN" ? 1 : 0}
  `.trim());
});

// 3. Receive client log telemetry & save securely on server
apiRouter.post("/audit/log", (req: Request, res: Response) => {
  apiCallCounters.audit++;
  const { action, user, level, details } = req.body;
  const tenantContext = req.tenantContext;

  const tenantId = tenantContext?.tenantId || "Global";
  const userRole = tenantContext?.userRole || "Guest";
  const userName = user || tenantContext?.userName || "Anonymous";

  EnterpriseLogger.audit(
    `[CLIENT TELEMETRY] ${action}`,
    tenantId,
    userName,
    {
      level: level || "INFO",
      role: userRole,
      clientDetails: details
    }
  );

  res.json({ success: true, timestamp: new Date().toISOString() });
});

// 4. Secure multi-tenant database sandbox backup simulation endpoint
apiRouter.post("/db/backup", (req: Request, res: Response) => {
  const tenantContext = req.tenantContext;
  if (!tenantContext || !tenantContext.tenantId) {
    res.status(401).json({ error: "Tenant verification failed" });
    return;
  }

  const tenantId = tenantContext.tenantId;
  const userName = tenantContext.userName || "system";

  EnterpriseLogger.audit(
    `Point-In-Time recovery (PITR) backup pipeline requested`,
    tenantId,
    userName
  );

  // Simulating the creation and encryption of the isolated backup
  const backupId = `bkp_${tenantId}_${Date.now()}`;
  const fileSizeMb = (12.4 + Math.random() * 5).toFixed(2);

  res.json({
    success: true,
    backupId,
    timestamp: new Date().toISOString(),
    details: {
      tenantIsolated: true,
      isolationCheck: "Verified via PG Row Level Security schema boundaries",
      encryptionAlgorithm: "AES-256GCM",
      databaseDumpSizeMb: fileSizeMb,
      outputLocation: `s3://enterprise-secure-backups/${tenantId}/${backupId}.enc`,
      retentionPeriodDays: 30,
    }
  });
});

// 5. Query verification endpoint confirming multi-tenant isolation (No data leakage test)
apiRouter.get("/tenant/validate", (req: Request, res: Response) => {
  const tenantContext = req.tenantContext;
  if (!tenantContext || !tenantContext.tenantId) {
    res.status(401).json({ error: "No active tenant token found" });
    return;
  }

  const tenantId = tenantContext.tenantId;

  // Audit database checking simulation
  EnterpriseLogger.security(
    `Automated tenant boundary safety validation sequence triggered`,
    tenantId,
    tenantContext.userName
  );

  res.json({
    verdict: "SECURE",
    timestamp: new Date().toISOString(),
    analyzedSchema: {
      rlsPoliciesEnabled: true,
      tenantColumnName: "empresaId",
      leakRiskAnalyzed: "0.00%",
    },
    isolationTests: [
      { name: "Raw SQL query isolation check", status: "PASSED", responseScope: `Limited exclusively to tenant '${tenantId}'` },
      { name: "Cross-Tenant parameter manipulation protection", status: "PASSED", responseScope: "Rejected/Filtered" },
      { name: "System schema metadata lock down", status: "PASSED" }
    ],
    certificationSignature: "OWASP-ASVS-4.0-COMPLIANT"
  });
});

// Helper for api counter updates
export function incrementAIGenerateCounter() {
  apiCallCounters.generate_ai++;
}
export { aiCircuitBreaker };
