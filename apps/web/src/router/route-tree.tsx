import { RootRoute, Route } from '@tanstack/react-router'
import { RootLayout } from '@routes/__root'
import { LandingPage } from '@routes/home'
import { AuthLayout } from '@routes/_auth-layout'
import { LoginPage } from '@routes/auth/login-page'
import { RegisterPage } from '@routes/auth/register-page'
import { DashboardLayout } from '@routes/_dashboard-layout'
import { OverviewPage } from '@routes/dashboard/overview-page'
import { AnalyticsPage } from '@routes/dashboard/analytics-page'
import { SettingsPage } from '@routes/dashboard/settings-page'
import { SchoolListPage } from '@routes/schools/school-list-page'
import { SchoolDetailPage } from '@routes/schools/school-detail-page'
import { ClassListPage } from '@routes/classes/class-list-page'
import { ClassDetailPage } from '@routes/classes/class-detail-page'
import { SubjectListPage } from '@routes/subjects/subject-list-page'
import { TeacherListPage } from '@routes/teachers/teacher-list-page'
import { StudentListPage } from '@routes/students/student-list-page'
import { StudentDetailPage } from '@routes/students/student-detail-page'
import { AssessmentListPage } from '@routes/assessments/assessment-list-page'
import { AssessmentCreatePage } from '@routes/assessments/assessment-create-page'
import { AssessmentDetailPage } from '@routes/assessments/assessment-detail-page'
import { InsightListPage } from '@routes/insights/insight-list-page'
import { InsightDetailPage } from '@routes/insights/insight-detail-page'
import { NotFoundPage } from '@routes/errors/not-found-page'
import { ErrorPage } from '@routes/errors/error-page'

const rootRoute = new RootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const authLayout = new Route({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: AuthLayout,
})

const loginRoute = new Route({
  getParentRoute: () => authLayout,
  path: '/auth/login',
  component: LoginPage,
})

const registerRoute = new Route({
  getParentRoute: () => authLayout,
  path: '/auth/register',
  component: RegisterPage,
})

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardLayout,
})

const overviewRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: '',
  id: 'overview',
  component: OverviewPage,
})

const analyticsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'analytics',
  component: AnalyticsPage,
})

const settingsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'settings',
  component: SettingsPage,
})

const schoolsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'schools',
  component: SchoolListPage,
})

const schoolDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'schools/$schoolId',
  component: SchoolDetailPage,
})

const classesListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'classes',
  component: ClassListPage,
})

const classDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'classes/$classId',
  component: ClassDetailPage,
})

const subjectsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'subjects',
  component: SubjectListPage,
})

const teachersListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'teachers',
  component: TeacherListPage,
})

const studentsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'students',
  component: StudentListPage,
})

const studentDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'students/$studentId',
  component: StudentDetailPage,
})

const assessmentsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'assessments',
  component: AssessmentListPage,
})

const assessmentCreateRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'assessments/new',
  component: AssessmentCreatePage,
})

const assessmentDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'assessments/$assessmentId',
  component: AssessmentDetailPage,
})

const insightsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'insights',
  component: InsightListPage,
})

const insightDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'insights/$insightId',
  component: InsightDetailPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  authLayout.addChildren([loginRoute, registerRoute]),
  dashboardRoute.addChildren([
    overviewRoute,
    analyticsRoute,
    settingsRoute,
    schoolsListRoute,
    schoolDetailRoute,
    classesListRoute,
    classDetailRoute,
    subjectsListRoute,
    teachersListRoute,
    studentsListRoute,
    studentDetailRoute,
    assessmentsListRoute,
    assessmentCreateRoute,
    assessmentDetailRoute,
    insightsListRoute,
    insightDetailRoute,
  ]),
])
