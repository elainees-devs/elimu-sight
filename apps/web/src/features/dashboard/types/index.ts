export interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalAssessments: number
  averageScore: number
  atRiskCount: number
}

export interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
}
