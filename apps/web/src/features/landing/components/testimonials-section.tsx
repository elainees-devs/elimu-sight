import { motion } from 'framer-motion'
import { SectionHeading } from '@shared/components/ui/section-heading'
import { testimonials } from '../data/testimonials'

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

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Trusted by Educators"
          subtitle="Hear from school leaders who are transforming education with ElimuSight."
          gradient
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-gray-600">&ldquo;{t.quote}&rdquo;</p>

              <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-sm font-bold text-white`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">
                    {t.role}, {t.school}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 via-vibrant-purple to-vibrant-cyan p-8 text-center text-white shadow-xl"
        >
          <div className="text-3xl font-bold">Join 500+ schools already using ElimuSight</div>
          <p className="mt-2 text-blue-100">Average improvement of 34% in student performance tracking efficiency</p>
        </motion.div>
      </div>
    </section>
  )
}
