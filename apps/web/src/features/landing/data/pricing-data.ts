export interface PricingTier {
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  studentLimit: number
  highlighted: boolean
  badge?: string
  features: { name: string; included: boolean }[]
  cta: string
  ctaVariant: 'primary' | 'secondary' | 'ghost'
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    description: 'Perfect for small schools exploring digital management.',
    monthlyPrice: 0,
    annualPrice: 0,
    studentLimit: 100,
    highlighted: false,
    features: [
      { name: 'Basic student profiles', included: true },
      { name: 'Manual attendance tracking', included: true },
      { name: 'Basic analytics dashboard', included: true },
      { name: 'Email support', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'AI-powered insights', included: false },
      { name: 'Automated reports', included: false },
      { name: 'Parent communication', included: false },
    ],
    cta: 'Get Started',
    ctaVariant: 'secondary',
  },
  {
    name: 'Basic',
    description: 'Ideal for growing schools needing advanced tools.',
    monthlyPrice: 200,
    annualPrice: 165,
    studentLimit: 500,
    highlighted: true,
    badge: 'Most Popular',
    features: [
      { name: 'Advanced student profiles', included: true },
      { name: 'Digital attendance tracking', included: true },
      { name: 'Advanced analytics dashboard', included: true },
      { name: 'AI-powered insights', included: true },
      { name: 'Automated report generation', included: true },
      { name: 'Parent communication portal', included: true },
      { name: 'Custom reports', included: false },
      { name: 'Priority support', included: false },
    ],
    cta: 'Subscribe',
    ctaVariant: 'primary',
  },
  {
    name: 'Premium',
    description: 'For large schools that need full customization and support.',
    monthlyPrice: 400,
    annualPrice: 330,
    studentLimit: -1,
    highlighted: false,
    badge: 'Best Value',
    features: [
      { name: 'Everything in Basic', included: true },
      { name: 'Unlimited students', included: true },
      { name: 'Custom report builder', included: true },
      { name: 'Priority 24/7 support', included: true },
      { name: 'API access', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'SLA guarantee', included: true },
    ],
    cta: 'Contact Sales',
    ctaVariant: 'primary',
  },
]

export const billingFrequencies = [
  { value: 'monthly' as const, label: 'Monthly' },
  { value: 'annual' as const, label: 'Annual' },
]
