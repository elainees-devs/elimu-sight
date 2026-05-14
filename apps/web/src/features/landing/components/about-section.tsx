import { motion } from 'framer-motion'
import { SectionHeading } from '@shared/components/ui/section-heading'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stats = [
  { value: '10+', label: 'Years Experience', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: '500+', label: 'Schools Supported', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { value: '50K+', label: 'Students Tracked', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { value: '99.9%', label: 'Uptime Guarantee', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
            >
              About ElimuSight
            </motion.span>
            <motion.h2
              variants={itemVariants}
              className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Empowering schools with{' '}
              <span className="text-gradient">data-driven intelligence</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg leading-relaxed text-gray-600"
            >
              ElimuSight was founded with a single mission: to transform how schools leverage
              data. We believe every student deserves personalized attention, and every educator
              deserves the tools to make that possible.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg leading-relaxed text-gray-600"
            >
              Our AI-powered platform helps schools identify at-risk students early, optimize
              resource allocation, and create data-driven strategies that improve educational
              outcomes across the board.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gradient-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
