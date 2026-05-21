import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, SectionHeading } from "@elimu-sight/ui"
import { cn } from '@elimu-sight/ui'
import { pricingTiers, billingFrequencies } from '../data/pricing-data'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Simple, transparent pricing"
          subtitle="Choose the plan that fits your school's needs. No hidden fees."
          gradient
        >
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
            {billingFrequencies.map((freq) => (
              <button
                key={freq.value}
                onClick={() => setBilling(freq.value)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                  billing === freq.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900',
                )}
              >
                {freq.label}
                {freq.value === 'annual' && (
                  <span className="ml-1.5 text-xs opacity-80">Save 20%</span>
                )}
              </button>
            ))}
          </div>
        </SectionHeading>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 grid gap-8 lg:grid-cols-3"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl',
                tier.highlighted && 'border-blue-200 shadow-blue-100/50 ring-1 ring-blue-500',
              )}
            >
              {tier.badge && (
                <span
                  className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold shadow-sm',
                    tier.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-vibrant-purple text-white'
                      : 'bg-gray-100 text-gray-700',
                  )}
                >
                  {tier.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    KES {billing === 'monthly' ? tier.monthlyPrice.toLocaleString() : tier.annualPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    /student/{billing === 'monthly' ? 'mo' : 'mo (billed annually)'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {tier.studentLimit === -1 ? 'Unlimited students' : `Up to ${tier.studentLimit} students`}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature.name} className="flex items-start gap-3 text-sm">
                    {feature.included ? (
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-vibrant-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={cn(feature.included ? 'text-gray-700' : 'text-gray-400')}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.ctaVariant}
                className="w-full"
                size="lg"
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
