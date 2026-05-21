import app from "./app";
import { env, logger, prisma } from "@utils/index";

const PORT = env.PORT;

// STARTUP VALIDATION
const startupWarnings: string[] = [];
if (env.SENTRY_DSN) {
  logger.info("Sentry DSN configured");
} else {
  startupWarnings.push("SENTRY_DSN not set — error tracking disabled");
}
for (const warning of startupWarnings) {
  logger.warn(warning);
}

// START SERVER
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
});

// =========================================
// GRACEFUL SHUTDOWN
// =========================================
async function gracefulShutdown(signal: string) {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info("HTTP server closed");

    await prisma.$disconnect();
    logger.info("Database connection closed");

    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// HANDLE UNHANDLED REJECTIONS
process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled Rejection:", reason);

  server.close(() => {
    process.exit(1);
  });
});

// HANDLE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (error: unknown) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});
