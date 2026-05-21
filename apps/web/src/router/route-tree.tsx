import { RootRoute, Route } from '@tanstack/react-router'
import type { Role } from "@elimu-sight/types"
import { RootLayout } from '@routes/__root'
import { LandingPage } from '@routes/home'
import { AuthLayout } from '@routes/_auth-layout'
import { LoginPage } from '@routes/auth/login-page'
import { RegisterPage } from '@routes/auth/register-page'
import { DashboardLayout } from '@routes/_dashboard-layout'
import { OverviewPage } from '@routes/dashboard/overview-page'
import { MyClassPage } from '@routes/dashboard/my-class-page'
import { AnalyticsPage } from '@routes/dashboard/analytics-page'
import { SettingsPage } from '@routes/dashboard/settings-page'
import { SchoolListPage } from '@routes/schools/school-list-page'
import { SchoolDetailPage } from '@routes/schools/school-detail-page'
import { ClassListPage } from '@routes/classes/class-list-page'
import { ClassDetailPage } from '@routes/classes/class-detail-page'
import { SubjectListPage } from '@routes/subjects/subject-list-page'
import { TeacherListPage } from '@routes/teachers/teacher-list-page'
import { TeacherDetailPage } from '@routes/teachers/teacher-detail-page'
import { UserListPage } from '@routes/users/user-list-page'
import { StudentListPage } from '@routes/students/student-list-page'
import { StudentDetailPage } from '@routes/students/student-detail-page'
import { AssessmentListPage } from '@routes/assessments/assessment-list-page'
import { AssessmentCreatePage } from '@routes/assessments/assessment-create-page'
import { AssessmentDetailPage } from '@routes/assessments/assessment-detail-page'
import { InsightListPage } from '@routes/insights/insight-list-page'
import { InsightDetailPage } from '@routes/insights/insight-detail-page'
import { NotFoundPage } from '@routes/errors/not-found-page'
import { ErrorPage } from '@routes/errors/error-page'
import { RoleRoute } from './role-route'
import { AdminOverviewPage } from '@routes/dashboard/admin/overview-page'
import { TenantListPage } from '@routes/dashboard/admin/tenants-page'
import { TenantDetailPage } from '@routes/dashboard/admin/tenant-detail-page'
import { AdminUserListPage } from '@routes/dashboard/admin/users-page'
import { AIAnalyticsPage } from '@routes/dashboard/admin/ai-page'
import { SystemHealthPage } from '@routes/dashboard/admin/health-page'
import { SecurityAuditPage } from '@routes/dashboard/admin/security-page'
import { BillingPage } from '@routes/dashboard/admin/billing-page'
import { AnnouncementsPage } from '@routes/dashboard/admin/announcements-page'
import { SupportTicketsPage } from '@routes/dashboard/admin/support-page'

function wrapWithRole(Component: () => JSX.Element, allowedRoles: Role[]) {
  return () => (
    <RoleRoute allowedRoles={allowedRoles}>
      <Component />
    </RoleRoute>
  )
}

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
  component: wrapWithRole(OverviewPage, ['SUPER_ADMIN', 'ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT']),
})

const analyticsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'analytics',
  component: wrapWithRole(AnalyticsPage, ['SUPER_ADMIN', 'ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT']),
})

const settingsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'settings',
  component: wrapWithRole(SettingsPage, ['SUPER_ADMIN', 'ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT']),
})

const myClassRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'my-class',
  component: wrapWithRole(MyClassPage, ['TEACHER']),
})

const schoolsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'schools',
  component: wrapWithRole(SchoolListPage, ['SUPER_ADMIN', 'ADMIN']),
})

const schoolDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'schools/$schoolId',
  component: wrapWithRole(SchoolDetailPage, ['SUPER_ADMIN', 'ADMIN']),
})

const classesListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'classes',
  component: wrapWithRole(ClassListPage, ['ADMIN', 'HEADTEACHER', 'TEACHER']),
})

const classDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'classes/$classId',
  component: wrapWithRole(ClassDetailPage, ['ADMIN', 'HEADTEACHER', 'TEACHER']),
})

const subjectsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'subjects',
  component: wrapWithRole(SubjectListPage, ['ADMIN', 'HEADTEACHER', 'TEACHER']),
})

const usersListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'users',
  component: wrapWithRole(UserListPage, ['ADMIN']),
})

const teachersListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'teachers',
  component: wrapWithRole(TeacherListPage, ['ADMIN', 'HEADTEACHER']),
})

const teacherDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'teachers/$teacherId',
  component: wrapWithRole(TeacherDetailPage, ['ADMIN', 'HEADTEACHER']),
})

const studentsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'students',
  component: wrapWithRole(StudentListPage, ['ADMIN', 'HEADTEACHER', 'TEACHER']),
})

const studentDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'students/$studentId',
  component: wrapWithRole(StudentDetailPage, ['ADMIN', 'HEADTEACHER', 'TEACHER']),
})

const assessmentsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'assessments',
  component: wrapWithRole(AssessmentListPage, ['ADMIN', 'HEADTEACHER', 'TEACHER']),
})

const assessmentCreateRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'assessments/new',
  component: wrapWithRole(AssessmentCreatePage, ['ADMIN', 'HEADTEACHER', 'TEACHER']),
})

const assessmentDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'assessments/$assessmentId',
  component: wrapWithRole(AssessmentDetailPage, ['ADMIN', 'HEADTEACHER', 'TEACHER']),
})

const insightsListRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'insights',
  component: wrapWithRole(InsightListPage, ['ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT']),
})

const insightDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'insights/$insightId',
  component: wrapWithRole(InsightDetailPage, ['ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT']),
})

const adminOverviewRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin',
  component: wrapWithRole(AdminOverviewPage, ['SUPER_ADMIN']),
})

const adminTenantsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin/tenants',
  component: wrapWithRole(TenantListPage, ['SUPER_ADMIN']),
})

const adminTenantDetailRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin/tenants/$schoolId',
  component: wrapWithRole(TenantDetailPage, ['SUPER_ADMIN']),
})

const adminUsersRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin/users',
  component: wrapWithRole(AdminUserListPage, ['SUPER_ADMIN']),
})

const adminAIRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin/ai',
  component: wrapWithRole(AIAnalyticsPage, ['SUPER_ADMIN']),
})

const adminHealthRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin/health',
  component: wrapWithRole(SystemHealthPage, ['SUPER_ADMIN']),
})

const adminSecurityRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin/security',
  component: wrapWithRole(SecurityAuditPage, ['SUPER_ADMIN']),
})

const adminBillingRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin/billing',
  component: wrapWithRole(BillingPage, ['SUPER_ADMIN']),
})

const adminAnnouncementsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin/announcements',
  component: wrapWithRole(AnnouncementsPage, ['SUPER_ADMIN']),
})

const adminSupportRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'admin/support',
  component: wrapWithRole(SupportTicketsPage, ['SUPER_ADMIN']),
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  authLayout.addChildren([loginRoute, registerRoute]),
  dashboardRoute.addChildren([
    overviewRoute,
    analyticsRoute,
    settingsRoute,
    myClassRoute,
    schoolsListRoute,
    schoolDetailRoute,
    classesListRoute,
    classDetailRoute,
    subjectsListRoute,
    usersListRoute,
    teachersListRoute,
    teacherDetailRoute,
    studentsListRoute,
    studentDetailRoute,
    assessmentsListRoute,
    assessmentCreateRoute,
    assessmentDetailRoute,
    insightsListRoute,
    insightDetailRoute,
    adminOverviewRoute,
    adminTenantsRoute,
    adminTenantDetailRoute,
    adminUsersRoute,
    adminAIRoute,
    adminHealthRoute,
    adminSecurityRoute,
    adminBillingRoute,
    adminAnnouncementsRoute,
    adminSupportRoute,
  ]),
])
