import { prisma, ApiError, logger } from "@utils/index";
import { toCreateInsightDB, toUpdateInsightDB } from "mappers";

import {
  CreateInsightInput,
  UpdateInsightInput,
} from "schemas";

export class InsightCrudService {
  // ===============================
  // CREATE INSIGHT LOGIC
  // ===============================
  async createInsight(input: CreateInsightInput) {
    try {
      const data = toCreateInsightDB(input);

      const insight = await prisma.insights.create({
        data,
      });

      return insight;
    } catch {
      logger.error("Failed to create insight");
      throw new ApiError(500, "Failed to create insight");
    }
  }

  // ===============================
  // GET INSIGHT BY ID LOGIC
  // ===============================
  async getInsightById(id: string) {
    try {
      const insight = await prisma.insights.findFirst({
        where: { id },
      });

      if (!insight) {
        throw new ApiError(404, "Insight not found");
      }

      return insight;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch insight", { error });
      throw new ApiError(500, "Failed to fetch insight");
    }
  }

  // ===============================
  // UPDATE INSIGHT LOGIC
  // ===============================
  async updateInsight(id: string, input: UpdateInsightInput) {
    try {
      const data = toUpdateInsightDB(input);

      const existing = await prisma.insights.findFirst({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Insight not found");
      }

      const updated = await prisma.insights.update({
        where: { id },
        data,
      });

      return updated;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to update insight", { error });
      throw new ApiError(500, "Failed to update insight");
    }
  }

  // ===============================
  // SOFT DELETE INSIGHT LOGIC
  // ===============================
  async deleteInsight(id: string) {
    try {
      const existing = await prisma.insights.findFirst({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Insight not found");
      }

      const deleted = await prisma.insights.update({
        where: { id },
        data: {
          updated_at: new Date(),
          deleted_at: new Date(),
        },
      });

      return deleted;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to delete insight", { error });
      throw new ApiError(500, "Failed to delete insight");
    }
  }
}