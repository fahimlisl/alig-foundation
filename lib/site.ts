export const SITE = {
  name: 'Alig Foundation',
  tagline: 'An Initiative to Initiate',
  phone: '+91 74650 08633, +91 82796 64517',
  email: 'aligfoundation23@gmail.com',
  address: 'Main Road, Okhla Head, New Delhi',
  logo: '/images/alig-logo.jpeg',
}

export type CourseSlug = 'amu-ballb' | 'amu-ba' | 'amu-bafl' | 'amu-mba'

export type Course = {
  slug: CourseSlug
  short: string
  title: string
  full: string
  duration: string
  mode: string
  fee: string
  tagline: string
  description: string
  highlights: string[]
  syllabus: string[]
}

export const COURSES: Course[] = [
  {
    slug: 'amu-ballb',
    short: 'AMU BA LLB',
    title: 'AMU BA LLB Entrance',
    full: 'Bachelor of Arts + Bachelor of Laws (5 Years)',
    duration: '1 Year Program',
    mode: 'Online & Offline',
    fee: '₹45,000',
    tagline: 'Crack the AMU Law entrance with confidence.',
    description:
      'A comprehensive coaching program for the AMU BA LLB entrance examination covering legal aptitude, logical reasoning, English, and general knowledge with regular mock tests and personal mentorship.',
    highlights: [
      'Daily live & recorded classes',
      'Weekly full-length mock tests',
      'Legal reasoning & aptitude mastery',
      'Doubt-clearing sessions',
      'Previous year paper analysis',
    ],
    syllabus: [
      'Legal Aptitude & Legal Reasoning',
      'Logical Reasoning',
      'English Comprehension',
      'General Knowledge & Current Affairs',
      'Elementary Mathematics',
    ],
  },
  {
    slug: 'amu-ba',
    short: 'AMU BA',
    title: 'AMU BA Entrance',
    full: 'Bachelor of Arts (Honours)',
    duration: '1 Year Program',
    mode: 'Online & Offline',
    fee: '₹30,000',
    tagline: 'Build a strong foundation for AMU BA admission.',
    description:
      'Structured preparation for the AMU BA entrance exam with subject-wise modules, concept clarity sessions, and continuous assessment to keep you exam-ready.',
    highlights: [
      'Concept-focused teaching',
      'Subject-wise practice sets',
      'Monthly performance reviews',
      'Personalised study planner',
      'Interview & counselling guidance',
    ],
    syllabus: [
      'General English',
      'General Knowledge',
      'Reasoning & Mental Ability',
      'Indian History & Polity',
      'Current Affairs',
    ],
  },
  {
    slug: 'amu-bafl',
    short: 'AMU BAFL',
    title: 'AMU BA Foreign Languages',
    full: 'Bachelor of Arts in Foreign Languages',
    duration: '1 Year Program',
    mode: 'Online & Offline',
    fee: '₹32,000',
    tagline: 'Open doors to the world with AMU BAFL.',
    description:
      'Specialised coaching for the AMU BA Foreign Languages entrance, focusing on language aptitude, comprehension, and the analytical skills needed to excel.',
    highlights: [
      'Language aptitude training',
      'Comprehension & grammar drills',
      'Regular speaking practice',
      'Expert faculty mentorship',
      'Mock interviews',
    ],
    syllabus: [
      'English Language & Comprehension',
      'General Awareness',
      'Reasoning Ability',
      'Aptitude for Languages',
      'Current Affairs',
    ],
  },
  {
    slug: 'amu-mba',
    short: 'AMU MBA',
    title: 'AMU MBA Entrance',
    full: 'Master of Business Administration',
    duration: '1 Year Program',
    mode: 'Online & Offline',
    fee: '₹50,000',
    tagline: 'Lead the future of business — start at AMU.',
    description:
      'An intensive MBA entrance program covering quantitative ability, data interpretation, verbal ability, and logical reasoning, complete with GD and personal interview preparation.',
    highlights: [
      'Quant & DI intensive training',
      'Verbal ability mastery',
      'Group discussion practice',
      'Personal interview prep',
      'Sectional & full mock tests',
    ],
    syllabus: [
      'Quantitative Aptitude',
      'Data Interpretation & Logical Reasoning',
      'Verbal Ability & Reading Comprehension',
      'General Business Awareness',
      'Group Discussion & Interview',
    ],
  },
]

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Courses',
    href: '/courses',
    children: COURSES.map((c) => ({ label: c.short, href: `/courses/${c.slug}` })),
  },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Result', href: '/result' },
  { label: 'Contact', href: '/contact' },
]
