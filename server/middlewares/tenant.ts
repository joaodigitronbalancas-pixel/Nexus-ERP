/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { EnterpriseLogger } from "../utils/logger";

export interface TenantContext {
  tenantId: string;
  userRole?: string;
  userName?: string;
}

// Extend typical express request type safe wrapper
declare global {
  namespace Express {
    interface Request {
      tenantContext?: TenantContext;
    }
  }
}

export function multitenantContextEnforcer(req: Request, res: Response, next: NextFunction) {
  // Extract tenant code from headers
  const tenantHeader = req.headers["x-tenant-id"] || req.headers["X-Tenant-ID"];
  const roleHeader = req.headers["x-user-role"] || req.headers["X-User-Role"];
  const userHeader = req.headers["x-user-name"] || req.headers["X-User-Name"];

  const tenantId = typeof tenantHeader === "string" ? tenantHeader.trim() : "";
  const userRole = typeof roleHeader === "string" ? roleHeader.trim() : "Guest";
  const userName = typeof userHeader === "string" ? userHeader.trim() : "Anonymous";

  if (!tenantId) {
    // If we're hitting standard public routes like index or health, allow without tenant context
    if (req.path === "/api/health" || req.path === "/api/metrics" || !req.path.startsWith("/api/")) {
      return next();
    }
    
    EnterpriseLogger.warn(`Request to secure API blocked - Missing X-Tenant-ID header`, undefined, { url: req.url });
    res.status(400).json({
      error: "Authentication boundary violation. Tenant isolation token (X-Tenant-ID) required."
    });
    return;
  }

  // Bind tenant context securely to Express request lifecycle to prevent leakage
  req.tenantContext = {
    tenantId,
    userRole,
    userName
  };

  // Log audit trace for tenant accesses
  EnterpriseLogger.audit(`Access registered for isolated tenant scope`, tenantId, userName, {
    url: req.url,
    method: req.method,
    role: userRole
  });

  // Basic tenant-role access restrictions validation
  if (req.path.includes("/api/admin/") && userRole !== "SuperAdmin" && userRole !== "DonoEmpresa") {
    EnterpriseLogger.security(`Unauthorized administrative route attempt blocked`, tenantId, userName, { url: req.url, role: userRole });
    res.status(403).json({ error: "Access prohibited. Administrative privilege level required." });
    return;
  }

  next();
}
