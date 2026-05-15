import { PrismaClient } from "@prisma/client";

const databaseUrl = new URL(process.env.DATABASE_URL!);
databaseUrl.searchParams.set("connection_limit", process.env.DATABASE_POOL_SIZE || "10");

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl.toString(),
    },
  },
});