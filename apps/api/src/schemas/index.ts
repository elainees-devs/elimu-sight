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
  Class,
  CreateClassInput,
  UpdateClassInput,
  ClassIdParam,
} from "./class.schema";

// subject schemas
export {
  subjectSchema,
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdParamSchema,
  Subject,
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectIdParam,
} from "./subject.schema";

// student schemas
export {
  studentSchema,
  createStudentSchema,
  updateStudentSchema,
  studentIdParamSchema,
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentIdParam,
} from "./student.schema";

// assessment schemas
export {
  assessmentSchema,
  createAssessmentSchema,
  updateAssessmentSchema,
  assessmentIdParamSchema,
  assessmentSchoolAndIdParamSchema,
  Assessment,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  AssessmentIdParam,
} from "./assessment.schema";

// class-subject schemas
export {
  classSubjectSchema,
  createClassSubjectSchema,
  updateClassSubjectSchema,
  classSubjectIdParamSchema,
  ClassSubject,
  CreateClassSubjectInput,
  UpdateClassSubjectInput,
  ClassSubjectIdParam,
} from "./class-subject.schema";

// user schemas
export {
  userSchema,
  loginSchema,
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
    User,
    CreateUserInput,
    UpdateUserInput,
    AuthenticateUserInput,
    UserIdParam,
} from "./user.schema";

// teacher schemas
export {
  teacherIdParamSchema,
  updateTeacherSchema,
  assignClassSchema,
  TeacherIdParam,
  UpdateTeacherInput,
  AssignClassInput,
} from "./teacher.schema";

// insight schemas
export {
  insightSchema,
  createInsightSchema,
  updateInsightSchema,
  insightIdParamSchema,
  Insight,
  CreateInsightInput,
  UpdateInsightInput,
  InsightIdParam,
} from "./insight.schema";
