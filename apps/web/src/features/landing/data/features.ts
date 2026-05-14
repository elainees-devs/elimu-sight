export interface ProductFeature {
  icon: string
  title: string
  description: string
  color: string
}

export const products: ProductFeature[] = [
  {
    icon: 'graduation-cap',
    title: 'Student Management',
    description: 'Comprehensive student profiles, enrollment tracking, and academic history all in one place.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: 'bar-chart-3',
    title: 'School Analytics',
    description: 'Real-time dashboards and performance metrics to make data-driven decisions.',
    color: 'from-vibrant-purple to-purple-600',
  },
  {
    icon: 'wallet',
    title: 'Finance & Billing',
    description: 'Automated fee collection, invoicing, and financial reporting for your school.',
    color: 'from-vibrant-emerald to-emerald-600',
  },
  {
    icon: 'calendar-check',
    title: 'Attendance Tracking',
    description: 'Digital attendance with real-time tracking, reports, and parent notifications.',
    color: 'from-vibrant-cyan to-cyan-600',
  },
  {
    icon: 'sparkles',
    title: 'AI Insights',
    description: 'Machine learning models that identify at-risk students and predict academic outcomes.',
    color: 'from-vibrant-orange to-orange-600',
  },
  {
    icon: 'message-square',
    title: 'Parent Communication',
    description: 'Keep parents informed with automated updates, reports, and direct messaging.',
    color: 'from-vibrant-pink to-pink-600',
  },
  {
    icon: 'users',
    title: 'Staff Management',
    description: 'Manage teacher assignments, performance reviews, and professional development.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: 'file-text',
    title: 'Performance Reporting',
    description: 'Generate detailed reports on student and school performance with actionable insights.',
    color: 'from-teal-500 to-teal-600',
  },
]
