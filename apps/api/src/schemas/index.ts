// school schemas
export {
  schoolSchema,
  createSchoolSchema,
  updateSchoolSchema,
  schoolIdParamSchema,
  School,
  CreateSchoolInput,
  UpdateSchoolInput,
  SchoolIdParam,
} from "./school.schema";

// class schemas
export {
  classSchema,
  createClassSchema,
  updateClassSchema,
  classIdParamSchema,
} from "./class.schema";

// subject schemas
export {
  subjectSchema,
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdParamSchema,
} from "./subject.schema";

// student schemas
export {
  studentSchema,
  createStudentSchema,
  updateStudentSchema,
  studentIdParamSchema,
} from "./student.schema";

// assessment schemas
export {
  assessmentSchema,
  createAssessmentSchema,
  updateAssessmentSchema,
  assessmentIdParamSchema,
} from "./assessment.schema";

// class-subject schemas
export {
  classSubjectSchema,
  createClassSubjectSchema,
  updateClassSubjectSchema,
  classSubjectIdParamSchema,
} from "./class-subject.schema";

// user schemas
export {
  userSchema,
  authenticateUserSchema,
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
    User,
    CreateUserInput,
    UpdateUserInput,
    AuthenticateUserInput,
    UserIdParam,
} from "./user.schema";
