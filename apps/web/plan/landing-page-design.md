# ElimuSight Landing Page Redesign Plan

## Current State

- **File:** `src/routes/home.tsx` — single-file landing page with 4 basic sections (nav, hero, features grid, footer)
- **Design:** Minimal, no animations, no images/icons, raw `<button>`/`<div>` elements (doesn't use existing shared `Button`/`Card` components)
- **Animation library:** Not installed

## Architecture Decision: New `features/landing/` Module

Create a dedicated feature module for the landing page:

```
src/features/landing/
├── index.ts                           # barrel exports
├── data/
│   ├── features.ts                    # product/service grid data
│   ├── testimonials.ts                # testimonial data
│   ├── navigation.ts                  # footer nav links
│   └── pricing-data.ts               # pricing tiers & features
├── components/
│   ├── landing-page.tsx              # main orchestrator
│   ├── landing-nav.tsx               # sticky navigation bar
│   ├── hero-section.tsx              # hero with animated bg + floating cards
│   ├── products-section.tsx          # product/service grid
│   ├── pricing-section.tsx           # pricing grid with monthly/annual toggle
│   ├── about-section.tsx             # trust & about section
│   ├── testimonials-section.tsx      # testimonial cards
│   ├── contact-section.tsx           # contact form
│   ├── booking-modal.tsx             # demo booking modal
│   └── landing-footer.tsx            # modern SaaS footer
```

`src/routes/home.tsx` becomes a thin re-export:

```tsx
export { LandingPage } from '@features/landing'
```

## Dependencies to Install

- `framer-motion` — scroll-triggered animations, floating elements, microinteractions

## Section Order

```
<LandingNav />
<HeroSection />
<ProductsSection />
<PricingSection />
<AboutSection />
<TestimonialsSection />
<ContactSection />
<LandingFooter />
```

---

## Design System & Shared Components

### Colors
- Extend Tailwind config with vibrant accent colors (cyan, purple, emerald)
- Keep existing `primary` blue palette
- Add gradient color stops

### Typography
- Large bold headlines with gradient text (`bg-clip-text text-transparent bg-gradient-to-r`)
- Readable body text (`text-lg` for key copy)
- Consistent spacing using Tailwind spacing scale

### Animations (framer-motion)
- `fade-up` — sections fade in from below on scroll
- `stagger-children` — card grids stagger entrance
- `float` — decorative elements bob gently
- `gradient-shift` — hero background gradient animates
- `hover-lift` — cards lift on hover (`y` transform + shadow)

### Reusable Shared Components
- `SectionHeading` — consistent H2 + subtitle with optional gradient

---

## Section Specifications

### 1. Landing Nav

- Sticky, glassmorphism (`bg-white/70 backdrop-blur-xl`), border-b
- Logo with SVG icon
- Nav links: Products, Pricing, About, Testimonials, Contact
- Right side: "Sign in" (ghost `Button`), "Get Started" (primary `Button`)
- Mobile: hamburger menu with slide-out drawer
- Uses existing `Button` component

### 2. Hero Section

- Full-viewport-height, overflow-hidden
- Animated gradient background (`@keyframes gradient-shift`)
- Floating decorative elements (framer-motion `y` oscillation)
- Headline with gradient text
- Subheadline (`text-lg`, `max-w-2xl`)
- Primary CTA "Get Started Free" → `/auth/register` (`Button` `lg` `primary`)
- Trust indicators row: "500+ Schools", "99.9% Uptime", "GDPR Compliant"
- Dashboard mockup image/placeholder

### 3. Products Section

- SectionHeading: "Everything you need" / subtitle
- Responsive grid: 1 → 2 → 3 → 4 columns
- Product cards: gradient icon circle, title, description, "Learn more"
- Uses existing `Card` with hover elevation
- framer-motion `staggerChildren` entrance

**Products (8):**
1. Student Management
2. School Analytics
3. Finance & Billing
4. Attendance Tracking
5. AI Insights
6. Parent Communication
7. Staff Management
8. Performance Reporting

### 4. Pricing Section

- Monthly/Annual toggle pill button
- Annual: ~17% discount with "Save 20%" badge

| Feature | Free | Basic | Premium |
|---|---|---|---|
| **Price/student/mo (monthly)** | $0 | $3 | $6 |
| **Price/student/mo (annual)** | $0 | $2.50 | $5 |
| **Student limit** | 100 | 500 | Unlimited |
| **Basic analytics** | ✓ | ✓ | ✓ |
| **Advanced analytics** | — | ✓ | ✓ |
| **AI-powered insights** | — | ✓ | ✓ |
| **Automated reports** | — | ✓ | ✓ |
| **Custom reports** | — | — | ✓ |
| **Parent communication** | — | ✓ | ✓ |
| **Priority support** | — | — | ✓ |
| **API access** | — | — | ✓ |

- 3-column responsive grid (1→2→3)
- Free: muted card. Basic: highlighted "Most Popular" with gradient border. Premium: subtle glow
- Checkmark/X icons for features
- CTA: `Button` per tier

### 5. About & Trust Section

- Two-column: text | trust indicators
- Mission, Vision, company story
- Stat cards: "10+ Years", "500+ Schools", "50K+ Students", "99.9% Uptime"
- Uses existing `Card`

### 6. Testimonials Section

- SectionHeading: "Trusted by Educators"
- Responsive card grid (no carousel — simpler, more accessible)
- Quote icon, star rating, avatar placeholder, name/role/school
- Hover lift effect
- Success metrics callout row

**Testimonials (4-6):**
- Realistic personas (principal, head teacher, admin, IT director)
- Different school types (primary, secondary, international)

### 7. Contact & Booking Section

**Two-column layout:**
- **Contact form** (left): Full Name, Email, Message
  - Uses existing `Input`, `Textarea`, `Button`, `react-hook-form`, `zod`
  - Toast notification on success via existing `ToastProvider`
- **Booking card** (right): Calendar icon, description, "Book Demo" `Button` → opens `BookingModal`

**Booking Modal:**
- Uses existing `Modal` component
- Date picker + Time select
- "Confirm Booking" with loading state
- Escape-to-close, focus trap, keyboard nav

### 8. Footer

- Multi-column responsive: Logo+description | Product links | Company links | Contact
- Social media icon row (SVG)
- Divider + copyright
- Stacked on mobile

---

## Performance & Accessibility

### Performance
- Lazy load non-critical sections via `React.lazy()`
- Use `use-intersection-observer` (exists in `src/shared/hooks/`) for trigger-once animations
- `React.memo` on static section components
- Inline SVGs for icons (no raster images)

### Accessibility
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`
- Skip-to-content link
- Proper heading hierarchy (h1 → h2 → h3 → h4)
- ARIA labels on interactive elements
- Focus management in modal
- Color contrast compliance with Tailwind palette
- `prefers-reduced-motion` respects framer-motion's `useReducedMotion`

### SEO
- Semantic structure for search engines
- Proper heading hierarchy
- Meta description support
- Accessible link text
- Alt text on any images

---

## Implementation Order

1. Install `framer-motion`
2. Extend `tailwind.config.ts` (animations, colors)
3. Update `globals.css` (@keyframes)
4. Create shared `section-heading.tsx`
5. Create data files (features, testimonials, navigation, pricing)
6. Build section components one-by-one:
   - landing-nav → hero → products → pricing → about → testimonials → contact → booking-modal → footer
7. Create `landing-page.tsx` orchestrator
8. Update `home.tsx` route file to re-export
9. Verify build and responsiveness

---

## Files to Create (16)

| # | File | Purpose |
|---|------|---------|
| 1 | `src/features/landing/index.ts` | Barrel exports |
| 2 | `src/features/landing/data/features.ts` | Products data |
| 3 | `src/features/landing/data/testimonials.ts` | Testimonials data |
| 4 | `src/features/landing/data/navigation.ts` | Footer links data |
| 5 | `src/features/landing/data/pricing-data.ts` | Pricing tiers & features |
| 6 | `src/features/landing/components/landing-page.tsx` | Main orchestrator |
| 7 | `src/features/landing/components/landing-nav.tsx` | Navigation |
| 8 | `src/features/landing/components/hero-section.tsx` | Hero |
| 9 | `src/features/landing/components/products-section.tsx` | Products grid |
| 10 | `src/features/landing/components/pricing-section.tsx` | Pricing grid with toggle |
| 11 | `src/features/landing/components/about-section.tsx` | About/trust |
| 12 | `src/features/landing/components/testimonials-section.tsx` | Testimonials |
| 13 | `src/features/landing/components/contact-section.tsx` | Contact form |
| 14 | `src/features/landing/components/booking-modal.tsx` | Booking modal |
| 15 | `src/features/landing/components/landing-footer.tsx` | Footer |
| 16 | `src/shared/components/ui/section-heading.tsx` | Reusable section heading |

## Files to Modify (4)

| # | File | Change |
|---|------|--------|
| 1 | `src/routes/home.tsx` | Re-export `LandingPage` from feature module |
| 2 | `tailwind.config.ts` | Add animations, extend color palette |
| 3 | `src/styles/globals.css` | Add `@keyframes` for gradient/float animations |
| 4 | `package.json` | Add `framer-motion` dependency |
