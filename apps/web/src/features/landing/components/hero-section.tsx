import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Button } from '@shared/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const floatingCards = [
  { emoji: '📊', className: 'top-20 left-10 animate-float' },
  { emoji: '🎯', className: 'top-40 right-20 animate-float-delayed' },
  { emoji: '📈', className: 'bottom-32 left-20 animate-float' },
  { emoji: '🤖', className: 'bottom-20 right-10 animate-float-delayed' },
]

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: 'linear-gradient(-45deg, #eff6ff, #e0e7ff, #ecfeff, #f0fdf4)',
          backgroundSize: '400% 400%',
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-50" />

      {floatingCards.map((card, i) => (
        <div
          key={i}
          className={`absolute hidden lg:flex items-center gap-2 rounded-2xl glass-card px-4 py-3 shadow-xl ${card.className}`}
        >
          <span className="text-2xl">{card.emoji}</span>
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              AI-Powered School Intelligence Platform
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="text-gradient">
              Transform School Operations
            </span>
            <br />
            <span className="text-gray-900">with Smart Analytics</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl"
          >
            ElimuSight helps schools track performance, identify at-risk students,
            and make data-driven decisions with AI-powered insights and analytics.
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/auth/register' })}
            >
              Get Started Free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate({ to: '/auth/login' })}
            >
              Sign In
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-8"
          >
            {[
              { label: '500+', sub: 'Schools' },
              { label: '50K+', sub: 'Students' },
              { label: '99.9%', sub: 'Uptime' },
              { label: 'GDPR', sub: 'Compliant' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gradient-primary">{stat.label}</span>
                <span className="text-sm text-gray-500">{stat.sub}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mx-auto mt-12 max-w-4xl rounded-2xl border border-gray-200/50 bg-white/60 p-4 shadow-2xl backdrop-blur-sm"
          >
            <div className="aspect-video rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80"
                alt="School analytics dashboard showing student performance charts and data visualization on a tablet"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
