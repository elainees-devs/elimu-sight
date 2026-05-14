export interface PerformanceData {
  subject: string
  averageScore: number
  trend: 'up' | 'down' | 'stable'
}

export interface RiskData {
  studentId: string
  studentName: string
  riskLevel: 'low' | 'medium' | 'high'
  reason: string
}

export interface TrendData {
  period: string
  score: number
}

export interface SummaryStats {
  totalStudents: number
  averageScore: number
  passRate: number
  atRiskCount: number
}
