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

export interface StudentPerformanceItem {
  id: string
  fullName: string
  averageScore: number
  assessmentCount: number
}

export interface ClassPerformance {
  classId: string
  className: string
  totalStudents: number
  topPerformers: StudentPerformanceItem[]
  bottomPerformers: StudentPerformanceItem[]
}
