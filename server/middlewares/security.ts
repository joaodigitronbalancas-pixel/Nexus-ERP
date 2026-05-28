/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { EnterpriseLogger } from "../utils/logger";

// Simple and stable IP-based memory rate limiting to avoid external dependencies
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitDb = new Map<string, RateLimitRecord>();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 180; // Limit each IP to 180 requests per window

export function enterpriseRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
  const now = Date.now();

  const record = rateLimitDb.get(ip);

  if (!record) {
    rateLimitDb.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS
    });
    return next();
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + WINDOW_MS;
    return next();
  }

  record.count++;
  if (record.count > MAX_REQUESTS) {
    EnterpriseLogger.warn(`Rate limit exceeded for client IP`, undefined, { ip, count: record.count });
    res.status(429).json({
      error: "Too many requests. Operational threshold exceeded.",
      retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000)
    });
    return;
  }

  next();
}

// OWASP Security Headers Middleware (Helmet alternative)
export function applySecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  
  // Prevent MIME sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Enable browser XSS filtering
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Force HTTPS for production
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // CORS Policy Header Controls
  const allowedOrigin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Tenant-ID, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours

  // Set balanced CSP that supports standard sandboxes
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self' https:;"
  );

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Feature policy restrictions
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
}

// Anti-XSS and anti-SQLi injection pattern screening
export function sanitizePayloads(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") {
    const checkInjection = (obj: any): boolean => {
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          const val = obj[key].toLowerCase();
          
          // Pattern checking for rogue scripts
          if (val.includes("<script") || val.includes("javascript:") || val.includes("onload=")) {
            EnterpriseLogger.security(`Blocked potential XSS injection payload`, undefined, undefined, { key, val });
            return true;
          }

          // SQLi screening check
          if (val.includes("' or '1'='1") || val.includes("union select") || val.includes("drop table")) {
            EnterpriseLogger.security(`Blocked potential SQL injection payload`, undefined, undefined, { key, val });
            return true;
          }
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          if (checkInjection(obj[key])) return true;
        }
      }
      return false;
    };

    if (checkInjection(req.body)) {
      res.status(400).json({ error: "Suspicious payload blocked by Nexus Security Control Center." });
      return;
    }
  }
  next();
}
