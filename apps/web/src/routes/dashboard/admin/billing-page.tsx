import { useBillingOverview, useChangeSchoolPlan } from '@features/admin'
import { SubscriptionBadge } from '@features/admin/components/subscription-badge'
import { MetricCard } from '@features/admin/components/metric-card'
import { useState } from 'react'

export function BillingPage() {
  const { data: billing, isLoading } = useBillingOverview()
  const changePlan = useChangeSchoolPlan()
  const [schoolId, setSchoolId] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('FREE')

  const handleChangePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!schoolId) return
    await changePlan.mutateAsync({ id: schoolId, plan: selectedPlan })
    setSchoolId('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="mt-1 text-gray-600">Subscription plans and revenue overview</p>
      </div>

      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      ) : billing ? (
        <>
          <div className="grid gap-6 sm:grid-cols-3">
            <MetricCard label="Active Subscriptions" value={billing.activeSubscriptions} />
            <MetricCard label="Total Revenue" value={`$${billing.totalRevenue}`} />
            <MetricCard label="Plan Variants" value={billing.plans.length} />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Schools per Plan</h2>
            <div className="space-y-3">
              {billing.plans.map((p) => (
                <div key={p.plan} className="flex items-center justify-between">
                  <SubscriptionBadge plan={p.plan} />
                  <span className="text-sm font-medium text-gray-900">{p.count} schools</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Change School Plan</h2>
        <form onSubmit={handleChangePlan} className="flex items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">School ID</label>
            <input
              className="rounded-lg border px-3 py-2 text-sm"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              placeholder="School UUID"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">New Plan</label>
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="FREE">Free</option>
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Update Plan
          </button>
        </form>
      </div>
    </div>
  )
}
