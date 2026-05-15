import { PrismaClient } from "@prisma/client";

const databaseUrl = new URL(process.env.DATABASE_URL!);

databaseUrl.searchParams.set("connection_limit", process.env.DATABASE_POOL_SIZE || "10");
databaseUrl.searchParams.set("pool_timeout", process.env.DATABASE_POOL_CONNECTION_TIMEOUT || "2000");
databaseUrl.searchParams.set("idle_timeout", process.env.DATABASE_POOL_IDLE_TIMEOUT || "30000");
databaseUrl.searchParams.set("max_lifetime", process.env.DATABASE_POOL_MAX_LIFETIME || "60000");

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl.toString(),
    },
  },
});