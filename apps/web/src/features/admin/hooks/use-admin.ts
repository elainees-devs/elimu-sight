import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminClient } from '../api/admin-client'

export function useAdminOverview() {
  return useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => {
      const res = await adminClient.overview()
      return res.data.data
    },
  })
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ['admin', 'health'],
    queryFn: async () => {
      const res = await adminClient.health()
      return res.data.data
    },
  })
}

export function useAdminSchools(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'schools', params],
    queryFn: async () => {
      const res = await adminClient.schools(params)
      return { data: res.data.data, meta: res.data.meta }
    },
  })
}

export function useAdminSchoolDetail(id: string) {
  return useQuery({
    queryKey: ['admin', 'schools', id],
    queryFn: async () => {
      const res = await adminClient.schoolDetail(id)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useAdminUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const res = await adminClient.users(params)
      return { data: res.data.data, meta: res.data.meta }
    },
  })
}

export function useAIUsage() {
  return useQuery({
    queryKey: ['admin', 'ai-usage'],
    queryFn: async () => {
      const res = await adminClient.aiUsage()
      return res.data.data
    },
  })
}

export function useAIUsageTrends(days?: number) {
  return useQuery({
    queryKey: ['admin', 'ai-usage-trends', days],
    queryFn: async () => {
      const res = await adminClient.aiUsageTrends(days)
      return res.data.data
    },
  })
}

export function useInsightStats() {
  return useQuery({
    queryKey: ['admin', 'insight-stats'],
    queryFn: async () => {
      const res = await adminClient.insightStats()
      return res.data.data
    },
  })
}

export function useAuditLogs(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: async () => {
      const res = await adminClient.auditLogs(params)
      return { data: res.data.data, meta: res.data.meta }
    },
  })
}

export function useAuditLogStats() {
  return useQuery({
    queryKey: ['admin', 'audit-log-stats'],
    queryFn: async () => {
      const res = await adminClient.auditLogStats()
      return res.data.data
    },
  })
}

export function useSecurityOverview() {
  return useQuery({
    queryKey: ['admin', 'security-overview'],
    queryFn: async () => {
      const res = await adminClient.securityOverview()
      return res.data.data
    },
  })
}

export function useBillingOverview() {
  return useQuery({
    queryKey: ['admin', 'billing-overview'],
    queryFn: async () => {
      const res = await adminClient.billingOverview()
      return res.data.data
    },
  })
}

export function useAnnouncements(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'announcements', params],
    queryFn: async () => {
      const res = await adminClient.announcements(params)
      return { data: res.data.data, meta: res.data.meta }
    },
  })
}

export function useSupportTickets(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'support-tickets', params],
    queryFn: async () => {
      const res = await adminClient.supportTickets(params)
      return { data: res.data.data, meta: res.data.meta }
    },
  })
}

export function useCreateSchool() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => adminClient.createSchool(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'schools'] }),
  })
}

export function useUpdateSchool() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminClient.updateSchool(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'schools'] }),
  })
}

export function useDeleteSchool() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminClient.deleteSchool(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'schools'] }),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => adminClient.createUser(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminClient.updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useDeactivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminClient.deactivateUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useChangeSchoolPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: string }) =>
      adminClient.changeSchoolPlan(id, plan),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'billing-overview'] }),
  })
}

export function useCreateAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => adminClient.createAnnouncement(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'announcements'] }),
  })
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminClient.updateAnnouncement(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'announcements'] }),
  })
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminClient.deleteAnnouncement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'announcements'] }),
  })
}

export function useUpdateSupportTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminClient.updateSupportTicket(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'support-tickets'] }),
  })
}
