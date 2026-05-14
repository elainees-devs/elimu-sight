export interface Testimonial {
  name: string
  role: string
  school: string
  quote: string
  rating: number
  initials: string
  color: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    role: 'Principal',
    school: 'Riverside High School',
    quote: 'ElimuSight transformed how we track student performance. The AI insights helped us identify at-risk students 3 months earlier than our previous methods.',
    rating: 5,
    initials: 'SM',
    color: 'bg-blue-600',
  },
  {
    name: 'James Okonkwo',
    role: 'Head Teacher',
    school: 'St. Mary\'s Primary School',
    quote: 'The analytics dashboard gives me a complete picture of our school\'s performance in real-time. Administrative work that used to take days now takes minutes.',
    rating: 5,
    initials: 'JO',
    color: 'bg-vibrant-purple',
  },
  {
    name: 'Emily Chen',
    role: 'School Administrator',
    school: 'Pacific International School',
    quote: 'Attendance tracking and parent communication features alone saved us countless hours. Our parent engagement scores have improved by 40%.',
    rating: 5,
    initials: 'EC',
    color: 'bg-vibrant-cyan',
  },
  {
    name: 'David Kimani',
    role: 'Director of Academics',
    school: 'Nairobi Academy',
    quote: 'The assessment management module streamlined our entire examination process. We now have detailed analytics for every subject and class.',
    rating: 4,
    initials: 'DK',
    color: 'bg-vibrant-emerald',
  },
  {
    name: 'Amanda Foster',
    role: 'IT Coordinator',
    school: 'Westfield College',
    quote: 'Implementing ElimuSight was seamless. The support team was exceptional, and the platform\'s reliability has been outstanding. A game-changer for our school.',
    rating: 5,
    initials: 'AF',
    color: 'bg-vibrant-orange',
  },
]
