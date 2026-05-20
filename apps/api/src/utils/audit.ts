import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { logger } from "./logger";

interface LogAuditParams {
  action: string;
  resource: string;
  resourceId?: string;
  schoolId?: string;
  userId?: string;
  details?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    await prisma.audit_logs.create({
      data: {
        school_id: params.schoolId || null,
        user_id: params.userId || null,
        action: params.action,
        resource: params.resource,
        resource_id: params.resourceId || null,
        details: params.details ?? Prisma.DbNull,
        ip_address: params.ipAddress || null,
        user_agent: params.userAgent || null,
      },
    });
  } catch (error) {
    logger.error("Failed to write audit log:", error);
  }
}
