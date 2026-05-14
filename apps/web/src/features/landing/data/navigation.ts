export interface FooterLinkGroup {
  title: string
  links: { label: string; href: string }[]
}

export const footerLinks: FooterLinkGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Student Management', href: '#products' },
      { label: 'School Analytics', href: '#products' },
      { label: 'AI Insights', href: '#products' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'hello@elimuusight.com', href: 'mailto:hello@elimuusight.com' },
      { label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    ],
  },
]

export const socialLinks = [
  { label: 'Twitter', href: '#', icon: 'twitter' },
  { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  { label: 'GitHub', href: '#', icon: 'github' },
]

export const navLinks = [
  { label: 'Products', href: '#products' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]
