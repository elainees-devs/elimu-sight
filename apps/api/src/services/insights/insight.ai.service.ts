import { prisma, ApiError } from "@utils/index";
import { AIService } from "ai/ai.service";
import { InsightCrudService } from "./insight.crud.service";

export class InsightAIService {
  private aiService = new AIService();
  private insightCrudService = new InsightCrudService();

  // =========================================
  // GENERATE CLASS INSIGHT (AI ORCHESTRATION)
  // =========================================
  async generateClassInsight(classId: string, schoolId: string) {
    const classData = await prisma.classes.findUnique({
      where: { id: classId },
      include: { students: true, subjects: true },
    });

    this.validateAIInput(classData, "Class not found");

    const aiResponse = await this.aiService.generateClassInsight({
      type: "CLASS",
      context: classData,
    });

    return this.persistGeneratedInsights({
      schoolId,
      classId,
      type: "CLASS_PERFORMANCE",
      aiResponse,
    });
  }

  // =========================================
  // GENERATE STUDENT INSIGHT (AI ORCHESTRATION)
  // =========================================
  async generateStudentInsight(studentId: string, schoolId: string) {
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: {
        assessments: true,
        class: true,
      },
    });

    this.validateAIInput(student, "Student not found");

    const aiResponse = await this.aiService.generateStudentInsight({
      type: "STUDENT",
      context: student,
    });

    return this.persistGeneratedInsights({
      schoolId,
      classId: student!.class_id,
      studentId,
      type: "STUDENT_PERFORMANCE",
      aiResponse,
    });
  }

  // =========================================
  // GENERATE SUBJECT INSIGHT (AI ORCHESTRATION)
  // =========================================
  async generateSubjectInsight(subjectId: string, schoolId: string) {
    const subject = await prisma.subjects.findUnique({
      where: { id: subjectId },
      include: {
        assessments: true,
      },
    });

    this.validateAIInput(subject, "Subject not found");

    const aiResponse = await this.aiService.generateSubjectInsight({
      type: "SUBJECT",
      context: subject,
    });

    return this.persistGeneratedInsights({
      schoolId,
      subjectId,
      type: "SUBJECT_PERFORMANCE",
      aiResponse,
    });
  }

  // =========================================
  // REFRESH INSIGHT DATA (AI ORCHESTRATION)
  // =========================================
  async refreshInsight(insightId: string) {
    const existing = await prisma.insights.findUnique({
      where: { id: insightId },
    });

    this.validateAIInput(existing, "Insight not found");

    const aiResponse = await this.aiService.refreshInsights({
      type: existing!.type,
      context: existing!.data,
    });

    return this.insightCrudService.updateInsight(insightId, {
      title: aiResponse.title,
      summary: aiResponse.summary,
      data: aiResponse.data,
      confidenceScore: aiResponse.confidenceScore,
    });
  }

  // =========================================
  // BULK GENERATION
  // =========================================
  async generateBulkInsights(input: {
    schoolId: string;
    studentIds?: string[];
    classIds?: string[];
    subjectIds?: string[];
  }) {
    const results = [];

    if (input.studentIds?.length) {
      for (const id of input.studentIds) {
        results.push(await this.generateStudentInsight(id, input.schoolId));
      }
    }

    if (input.classIds?.length) {
      for (const id of input.classIds) {
        results.push(await this.generateClassInsight(id, input.schoolId));
      }
    }

    if (input.subjectIds?.length) {
      for (const id of input.subjectIds) {
        results.push(await this.generateSubjectInsight(id, input.schoolId));
      }
    }

    return {
      generated: results.length,
      results,
    };
  }

  // =========================================
  // VALIDATION
  // =========================================
  private validateAIInput(data: unknown, message: string) {
    if (!data) {
      throw new ApiError(404, message);
    }
  }

  // =========================================
  // NORMALIZE AI RESPONSE
  // =========================================
  private handleAIResponse(response: any) {
    return {
      title: response?.title ?? "AI Generated Insight",
      summary: response?.summary ?? "",
      data: response?.data ?? {},
      confidenceScore: response?.confidenceScore ?? 50,
    };
  }

  // =========================================
  // PERSIST GENERATED INSIGHTS
  // =========================================
  private async persistGeneratedInsights(input: {
    schoolId: string;
    classId?: string;
    studentId?: string;
    subjectId?: string;
    type: string;
    aiResponse: any;
  }) {
    const normalized = this.handleAIResponse(input.aiResponse);

    return this.insightCrudService.createInsight({
      schoolId: input.schoolId,
      classId: input.classId,
      studentId: input.studentId,
      subjectId: input.subjectId,
      type: input.type,
      title: normalized.title,
      summary: normalized.summary,
      data: normalized.data,
      confidenceScore: normalized.confidenceScore,
      generatedBy: "AI",
    });
  }
}