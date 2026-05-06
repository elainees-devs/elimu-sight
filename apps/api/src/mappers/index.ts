// school mappers
export {SchoolDB,toSchoolResponse, toSchoolListResponse, toCreateSchoolDB, toUpdateSchoolDB} from "./school.mapper";

// user mappers
export {toUserResponse,toUserListResponse ,toCreateUserDB, toUpdateUserDB} from "./user.mapper";

// subject mappers
export {toSubjectResponse, toSubjectListResponse, toCreateSubjectDB, toUpdateSubjectDB, SubjectDB} from "./subject.mapper";

// class mappers
export {toClassResponse, toClassListResponse, toCreateClassDB, toUpdateClassDB} from "./class.mapper";

// class-subject mappers
export {ClassSubjectDB,toClassSubjectId,toClassSubjectResponse, toClassSubjectListResponse, toCreateClassSubjectDB, toUpdateClassSubjectDB} from "./class-subject.mapper";

// student mappers
export {StudentDB,toStudentResponse, toStudentListResponse, toCreateStudentDB, toUpdateStudentDB} from "./student.mapper";

// assessment mappers
export {AssessmentDB,toAssessmentResponse, toAssessmentListResponse, toCreateAssessmentDB, toUpdateAssessmentDB, toAssessmentId} from "./assessment.mappers";

// insight mappers
export {toInsightResponse, toInsightListResponse, toCreateInsightDB, toUpdateInsightDB} from "./insight.mapper";