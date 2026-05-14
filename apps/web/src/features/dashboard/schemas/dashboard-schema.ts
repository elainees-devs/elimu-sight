import { z } from 'zod'

export const dashboardFilterSchema = z.object({
  schoolId: z.string().uuid().optional(),
})

export type DashboardFilter = z.infer<typeof dashboardFilterSchema>
