import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const env = {
  NODE_ENV: optionalEnv("NODE_ENV", "development"),
  PORT: parseInt(optionalEnv("PORT", "5000"), 10),

  DATABASE_URL: requireEnv("DATABASE_URL"),

  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: optionalEnv("JWT_EXPIRES_IN", "7d"),
  REFRESH_TOKEN_EXPIRES_IN: optionalEnv("REFRESH_TOKEN_EXPIRES_IN", "30d"),

  AI_SERVICE_URL: optionalEnv("AI_SERVICE_URL", "http://localhost:8000"),
  AI_SERVICE_API_KEY: optionalEnv("AI_SERVICE_API_KEY", ""),

  SENTRY_DSN: optionalEnv("SENTRY_DSN", ""),

  REDIS_URL: optionalEnv("REDIS_URL", "redis://localhost:6379"),

  CLIENT_URL: optionalEnv("CLIENT_URL", "http://localhost:5173"),

  get isDevelopment(): boolean {
    return this.NODE_ENV === "development";
  },

  get isProduction(): boolean {
    return this.NODE_ENV === "production";
  },

  get isTest(): boolean {
    return this.NODE_ENV === "test";
  },
} as const;
