import { PrismaClient } from "@prisma/client";

let _prisma: PrismaClient | null = null;

function initPrisma(): PrismaClient {
  if (!_prisma) {
    const databaseUrl = new URL(process.env.DATABASE_URL!);

    databaseUrl.searchParams.set("connection_limit", process.env.DATABASE_POOL_SIZE || "10");
    databaseUrl.searchParams.set("pool_timeout", process.env.DATABASE_POOL_CONNECTION_TIMEOUT || "2000");
    databaseUrl.searchParams.set("idle_timeout", process.env.DATABASE_POOL_IDLE_TIMEOUT || "30000");
    databaseUrl.searchParams.set("max_lifetime", process.env.DATABASE_POOL_MAX_LIFETIME || "60000");

    _prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl.toString(),
        },
      },
    });
  }
  return _prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: keyof PrismaClient) {
    return initPrisma()[prop];
  },
});

export async function disconnectPrisma(): Promise<void> {
  if (_prisma) {
    await _prisma.$disconnect();
    _prisma = null;
  }
}