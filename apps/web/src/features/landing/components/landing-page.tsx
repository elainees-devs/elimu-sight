import { lazy, Suspense } from 'react'
import { LandingNav } from './landing-nav'
import { HeroSection } from './hero-section'

const ProductsSection = lazy(() => import('./products-section').then(m => ({ default: m.ProductsSection })))
const PricingSection = lazy(() => import('./pricing-section').then(m => ({ default: m.PricingSection })))
const AboutSection = lazy(() => import('./about-section').then(m => ({ default: m.AboutSection })))
const TestimonialsSection = lazy(() => import('./testimonials-section').then(m => ({ default: m.TestimonialsSection })))
const ContactSection = lazy(() => import('./contact-section').then(m => ({ default: m.ContactSection })))
const LandingFooter = lazy(() => import('./landing-footer').then(m => ({ default: m.LandingFooter })))

function SectionFallback() {
  return <div className="h-96 animate-pulse bg-gray-50/50" />
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          <ProductsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <LandingFooter />
      </Suspense>
    </div>
  )
}
