import app from "./app";

const PORT = process.env.PORT || 5000;

// START SERVER
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// HANDLE UNHANDLED REJECTIONS
process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);

  server.close(() => {
    process.exit(1);
  });
});

// HANDLE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (error: unknown) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});