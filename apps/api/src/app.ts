import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "@middlewares/index";

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
} from "@routes/index";

import {
  insightCrudRoute,
  insightQueryRoute,
  insightAnalyticsRoute,
} from "@routes/insights";

const app: Application = express();

// =========================================
// CORE MIDDLEWARE
// =========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// =========================================
// HEALTH CHECK
// =========================================
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
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

// Insights module (big feature domain)
app.use("/api/v1/insights/crud", insightCrudRoute);
app.use("/api/v1/insights/query", insightQueryRoute);
app.use("/api/v1/insights/analytics", insightAnalyticsRoute);

// =========================================
// ERROR HANDLER (LAST)
// =========================================
app.use(errorHandler);

export default app;