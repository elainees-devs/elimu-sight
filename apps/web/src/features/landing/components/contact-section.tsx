import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Input, Textarea, SectionHeading } from "@elimu-sight/ui"
import { BookingModal } from './booking-modal'

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

export function ContactSection() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Get in touch"
          subtitle="Have questions or want to see ElimuSight in action? We'd love to hear from you."
          gradient
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid gap-12 lg:grid-cols-2"
        >
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
              />
              <Textarea
                label="Message"
                placeholder="Tell us about your school and what you're looking for..."
                rows={4}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                required
              />
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                {submitted ? 'Message Sent!' : 'Send Message'}
              </Button>
              {submitted && (
                <p className="text-sm text-vibrant-emerald">Thanks! We&apos;ll get back to you within 24 hours.</p>
              )}
            </form>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-sm">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-vibrant-cyan shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Book a Demo</h3>
              <p className="mt-2 text-gray-600">
                See ElimuSight in action. Schedule a personalized demo with our team and discover
                how we can help transform your school operations.
              </p>
              <Button
                size="lg"
                className="mt-6"
                onClick={() => setBookingOpen(true)}
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  )
}
