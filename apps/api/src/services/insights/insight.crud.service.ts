import { prisma, ApiError } from "@utils/index";
import { toCreateInsightDB, toUpdateInsightDB } from "mappers";

import {
  CreateInsightInput,
  UpdateInsightInput,
  InsightIdParam,
} from "schemas";

export class InsightCrudService {
  // ===============================
  // CREATE INSIGHT LOGIC
  // ===============================
  async createInsight(input: CreateInsightInput) {
    try {
      const data = toCreateInsightDB(input);

      const insight = await prisma.insight.create({
        data,
      });

      return insight;
    } catch (error) {
      throw new ApiError(500, "Failed to create insight");
    }
  }

  // ===============================
  // GET ALL INSIGHTS BY SCHOOL LOGIC
  // ===============================
  async getAllInsightsBySchool(schoolId: string) {
    try {
      const insights = await prisma.insight.findMany({
        where: {
          school_id: schoolId,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return insights;
    } catch (error) {
      throw new ApiError(500, "Failed to fetch insights");
    }
  }

  // ===============================
  // GET INSIGHT BY ID LOGIC
  // ===============================
  async getInsightById(id: string) {
    try {
      const insight = await prisma.insight.findFirst({
        where: {
          id,
        },
      });

      if (!insight) {
        throw new ApiError(404, "Insight not found");
      }

      return insight;
    } catch (error) {
      throw new ApiError(500, "Failed to fetch insight");
    }
  }

  // ===============================
  // UPDATE INSIGHT LOGIC
  // ===============================
  async updateInsight(id: string, input: UpdateInsightInput) {
    try {
      const data = toUpdateInsightDB(input);

      const existing = await prisma.insight.findFirst({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Insight not found");
      }

      const updated = await prisma.insight.update({
        where: { id },
        data,
      });

      return updated;
    } catch (error) {
      throw new ApiError(500, "Failed to update insight");
    }
  }

  // ===============================
  // SOFT DELETE INSIGHT LOGIC
  // ===============================
  async deleteInsight(id: string) {
    try {
      const existing = await prisma.insight.findFirst({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Insight not found");
      }

      const deleted = await prisma.insight.update({
        where: { id },
        data: {
          updated_at: new Date(),
          deleted_at: new Date() || null,
        },
      });

      return deleted;
    } catch (error) {
      throw new ApiError(500, "Failed to delete insight");
    }
  }
}
