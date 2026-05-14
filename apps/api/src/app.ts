import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "@middlewares/index";
import {
  globalRateLimiter,
  authRateLimiter,
  requestIdMiddleware,
} from "@middlewares/index";
import { env } from "@config/env";
import { logger, prisma } from "@utils/index";

// Routes
import {
  schoolRouter,
  authRouter,
  classRouter,
  studentRouter,
  subjectRouter,
  userRouter,
  classSubjectRouter,
  assessmentRouter,
  aiRouter,
  dashboardRouter,
} from "@routes/index";

import {
  insightCrudRoute,
  insightQueryRoute,
  insightAnalyticsRoute,
} from "@routes/insights";

const app: Application = express();

// =========================================
// TRUST PROXY (for rate limiting behind reverse proxy)
// =========================================
app.set("trust proxy", 1);

// =========================================
// REQUEST ID
// =========================================
app.use(requestIdMiddleware);

// =========================================
// CORE MIDDLEWARE
// =========================================
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// CORS
app.use(
  cors({
    origin: env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    credentials: true,
  })
);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: env.isProduction ? undefined : false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    hidePoweredBy: true,
    frameguard: { action: "deny" },
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// Rate limiting
app.use(globalRateLimiter);

// HTTP request logging
if (env.isProduction) {
  app.use(
    morgan("combined", {
      stream: { write: (message: string) => logger.info(message.trim()) },
    })
  );
} else {
  app.use(morgan("dev"));
}

// =========================================
// HEALTH CHECK
// =========================================
app.get("/health", async (_req, res) => {
  const checks: Record<string, string> = {};
  let healthy = true;

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch {
    checks.database = "disconnected";
    healthy = false;
  }

  checks.server = "running";

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    message: healthy ? "All systems operational" : "Some services degraded",
    checks,
    timestamp: new Date(),
  });
});

// =========================================
// API ROUTES
// =========================================
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/schools", schoolRouter);
app.use("/api/v1/classes", classRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/class-subjects", classSubjectRouter);
app.use("/api/v1/assessments", assessmentRouter);

// Dashboard
app.use("/api/v1/dashboard", dashboardRouter);

// AI-powered insights generation
app.use("/api/v1/ai", aiRouter);

// Insights module (big feature domain)
app.use("/api/v1/insights/crud", insightCrudRoute);
app.use("/api/v1/insights/query", insightQueryRoute);
app.use("/api/v1/insights/analytics", insightAnalyticsRoute);

// =========================================
// ERROR HANDLER (LAST)
// =========================================
app.use(errorHandler);

export default app;