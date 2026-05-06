import { ApiError } from "@utils/app-error";
import { prisma } from "@utils/prisma";
import { toSchoolListResponse } from "mappers/school.mapper";

export const SchoolService = {
  // =========================
// GET ALL SCHOOLS
// =========================
async getAllSchools() {
  try {
    const schools = await prisma.schools.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return toSchoolListResponse(schools);
  } catch (error) {
    throw new ApiError(500, "Failed to fetch schools");
  }


 }


}