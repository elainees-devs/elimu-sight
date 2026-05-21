import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { schoolClient } from '../api/school-client'
import type { PaginationMeta } from "@elimu-sight/types"

export function useSchools() {
  const [page, setPage] = useState(1)
  const limit = 12

  const query = useQuery({
    queryKey: ['schools', page],
    queryFn: async () => {
      const res = await schoolClient.list({ page, limit })
      return { schools: res.data.data, meta: res.data.meta }
    },
  })

  return {
    ...query,
    page,
    limit,
    setPage,
    totalPages: query.data?.meta?.totalPages ?? 1,
    total: query.data?.meta?.total ?? 0,
  }
}
