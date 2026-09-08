'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'

const TESTIMONIALS = [
  {
    quote:
      "Alhamdulillah I have secured 90 rank in AMU BA LLB entrance exam 2026. I would like to express my heartfelt gratitude to my teachers, Gufran Sir and Shahrukh Sir, for being such an important part of my journey. This achievement was not easy for me, especially as an external student. There were many challenges, doubts, and moments of pressure, but both my teachers guided me throughout this journey with constant support, motivation, and proper direction. Thank you so much for believing in me and helping me achieve this dream.",
    name: 'Suhaliya',
    detail: 'AMU BA LLB 2026',
    rank: 'Rank 90',
  },
  {
    quote:
      'Alhamdulillah, I have secured 73rd rank in AMU BA LLB 2026 entrance exam. I truly want to thank Alig Foundation for being such an important part of my preparation journey. The guidance, mocks, motivation, and constant support from the teachers really helped me improve and stay confident throughout this whole journey. Thank you Shahrukh Sir and Gufran Sir for always guiding and encouraging me — your teaching and support played a huge role in helping me achieve this result.',
    name: 'Zeba Parveen',
    detail: 'AMU BA LLB 2026',
    rank: 'Rank 73',
  },
  {
    quote:
      'I got Rank 26 (General) and Rank 13 (BC category) in AMU BA Hons entrance exam 2026. It\'s possible only because of Alig Foundation. The main motto — "Study limited, revise unlimited" — helped me secure this decent rank. I would like to thank the whole team, especially Shahrukh Sir and Gufran Sir, who mentored and motivated me. If you want selection along with a decent rank, Alig Foundation is the best.',
    name: 'Ilma',
    detail: 'AMU BA (Hons.) 2026',
    rank: 'Rank 26',
  },
  {
    quote:
      'Alhamdulillah, in AMU BA 2026 I have secured 120 in the General Category and Category Rank 22 (CA). I am truly grateful to Alig Foundation for the guidance, mentorship, and continuous support throughout my preparation journey. The dedication of the teachers, their constant motivation, and the student-friendly environment played a very important role in helping me achieve this result. A heartfelt thank you to Shahrukh Sir and Gufran Sir for their support and encouragement.',
    name: 'Nadia Rahim',
    detail: 'AMU BA 2026',
    rank: 'Rank 120',
  },
  {
    quote:
      'Alhamdulillah, I have been selected for AMU BA (Hons.) and secured 41st rank in the general category. I sincerely thank Alig Foundation for their constant guidance, support, and mentorship throughout my preparation journey. The teachers\' dedication and encouragement played a major role in my achievement. Thanks to Shahrukh Sir and the entire team.',
    name: 'Abeer Hamza',
    detail: 'AMU BA (Hons.) 2026',
    rank: 'Rank 41',
  },
  {
    quote:
      'In AMU BA LLB 2026 I have got the 14th rank in the general category — 1st rank in CE, 1st rank in CA, and the 1st rank in the General Category in the AMU BAFL entrance exam. The biggest contribution to my achievement has been Alig Foundation. The constant guidance and mentorship of the teachers, their availability for students, and their absolute excellence have led me here. A huge thank you to Shahrukh Sir and Gufran Sir.',
    name: 'Khadija Khan',
    detail: 'AMU BA LLB & BAFL 2026',
    rank: 'Rank 14',
  },
  {
    quote:
      'Alhamdulillah, I have been selected for AMU BA (Hons.) and secured 158th rank in the general category. I sincerely thank Alig Foundation for their constant guidance, support, and mentorship throughout my preparation journey. Although I prepared for just one month, the study material provided was extremely helpful, and the continuous guidance and encouragement played a major role. Special thanks to Shahrukh Sir and the entire team.',
    name: 'Mahira Hashmi',
    detail: 'AMU BA (Hons.) 2026',
    rank: 'Rank 158',
  },
  {
    quote:
      'I am deeply grateful to Alig Foundation for being an integral part of my journey and success in securing 19th rank in the general category and 7th rank in the special category in BA (Hons) 2025. This achievement would not have been possible without the dedicated guidance, constant encouragement, and unwavering support of my teachers — Shahrukh Sir, Gufran Sir, and Asaf Sir. Their expert teaching, well-structured materials, and motivating environment helped me stay focused and confident, preparing me not just for exams, but for life ahead.',
    name: 'Laiba Anwer',
    detail: 'AMU BA (Hons.) 2025',
    rank: 'Rank 19',
  },
  {
    quote:
      "I'm so happy to announce that I've been selected for AMU BA LLB 2026 with Rank 112! This achievement wouldn't have been possible without the guidance and support of Alig Foundation. You always treat us like your little siblings — sharing things that no other coaching centre tells their students. I'm truly grateful that I enrolled here. Thank you, Alig Foundation, and a special thank you to Gufran Sir and Shahrukh Sir.",
    name: 'Vedanti Sanwriya',
    detail: 'AMU BA LLB 2026',
    rank: 'Rank 112',
  },
]

const COURSE_FEATURES = [
  'Personal mentorship',
  '24x7 student support',
  'Affordable fees',
  'Live interactive classes',
  'Experienced faculty',
  'Comprehensive mock tests',
]

const EXTRA_FEATURES = [
  'Learn Anytime, Anywhere',
  'Comprehensive Study Material',
  'Concept-Based Learning',
  'Weekly Tests & Practice',
  'Expert Guidance',
  'Track Your Progress',
]

export function HomeFeatures() {
  return (
    <div className="relative">
      <div className="grid gap-8 sm:grid-cols-[3px_1fr]">
        <div
          className="hidden h-full w-[3px] rounded-full sm:block"
          style={{ background: 'linear-gradient(to bottom, var(--primary), transparent)' }}
        />

        <div>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            Education here isn't just teaching.{' '}
            <span className="text-primary">It's mentorship that doesn't stop.</span>
          </h2>

          {/* Course Features Description - Bold text */}
          <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Why Students Choose Alig Foundation?</span>
            <br />
            Our courses are designed specifically around the{' '}
            <span className="font-bold text-foreground">AMU entrance examination pattern, syllabus, and requirements</span>
            , keeping preparation focused and relevant.
          </p>

          {/* Course Features */}
          <div className="mt-8">
            <h3 className="font-heading text-lg font-bold text-foreground">
              <span className="text-primary">Course Features:</span>
            </h3>
            <ul className="mt-3 grid max-w-3xl gap-3 sm:grid-cols-2">
              {COURSE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="font-heading text-base font-bold text-foreground sm:text-lg">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Extra Features */}
          <div className="mt-8">
            <h3 className="font-heading text-lg font-bold text-foreground">
              <span className="text-primary">Extra features:</span>
            </h3>
            <ul className="mt-3 grid max-w-3xl gap-3 sm:grid-cols-2">
              {EXTRA_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="font-heading text-base font-bold text-foreground sm:text-lg">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* One Goal — AMU */}
          <div className="mt-10">
            <h3 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
              One Goal — <span className="text-primary">AMU</span>
            </h3>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground leading-relaxed">
              Everything we do is focused on helping students{' '}
              <span className="font-bold text-foreground">prepare better, perform confidently, and move closer to their dream of studying at Aligarh Muslim University.</span>
            </p>
          </div>

          <p className="mt-10 font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
            At Alig Foundation, your success{' '}
            <span className="text-primary">is our mission.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export function HomeTestimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < maxScroll - 8)

    const trackCenter = el.scrollLeft + el.clientWidth / 2
    let closestIdx = 0
    let closestDist = Infinity
    TESTIMONIALS.forEach((_, i) => {
      const card = el.children[i] as HTMLElement | undefined
      if (!card) return
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - trackCenter)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })
    setActiveIndex(closestIdx)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateEdges()

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateEdges)
    }
    el.addEventListener('scroll', onScroll, { passive: true })

    const onResize = () => updateEdges()
    window.addEventListener('resize', onResize)

    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [updateEdges])

  const scrollToIndex = (index: number) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.min(TESTIMONIALS.length - 1, Math.max(0, index))
    const slide = el.children[clamped] as HTMLElement | undefined
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }

  const goPrev = () => scrollToIndex(activeIndex - 1)
  const goNext = () => scrollToIndex(activeIndex + 1)

  return (
    <div>
      <div className="relative mt-12">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scroll-padding-inline:0.5rem] [scrollbar-width:none] sm:[scroll-padding-inline:1rem] [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: 'smooth' }}
        >
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex shrink-0 snap-center flex-col rounded-3xl border border-border bg-card p-7 [flex:0_0_calc(100%-1rem)] sm:[flex:0_0_calc((100%-1.5rem)/2)] lg:[flex:0_0_calc((100%-3rem)/3)]"
            >
              <Quote className="size-6 text-primary/60" />

              <blockquote className="mt-4 line-clamp-[10] text-[0.95rem] leading-relaxed text-card-foreground">
                {t.quote}
              </blockquote>

              <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                <div>
                  <p className="font-heading font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#a8324c] px-3 py-1 text-xs font-bold text-white">
                  {t.rank}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous testimonials"
          className="absolute -left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:bg-accent disabled:pointer-events-none disabled:opacity-0 sm:-left-4 sm:flex sm:size-11 lg:-left-5"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next testimonials"
          className="absolute -right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:bg-accent disabled:pointer-events-none disabled:opacity-0 sm:-right-4 sm:flex sm:size-11 lg:-right-5"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

interface Founder {
  name: string
  designation: string
  bio: string
  extraInfo?: string
  imageSrc: string
  imageAlt: string
}

const founders: Founder[] = [
  {
    name: 'Mohammad Shahrukh',
    designation: 'Founder & Management Head',
    bio: 'An alumnus of Satyawati College, Delhi University and Jamia Millia Islamia. He holds Bachelor\'s degrees in Economics with Political Science and Turkish Language. He is currently pursuing LL.B. and M.A. in Political Science. Under his guidance, many students have successfully secured admission to AMU and other reputed universities.',
    extraInfo: '🎓 DU · Jamia Millia · B.A. Economics, Political Science, Turkish',
    imageSrc: '/images/mohd_shahrukh_faculty.jpeg',
    imageAlt: 'Mohammad Shahrukh - Founder & Management Head',
  },
  {
    name: 'Gufran Chaudhary',
    designation: 'Co-Founder & Academic Head',
    bio: 'Focused on academic excellence, curriculum development, and student success. He holds an ',
    extraInfo: '📚 Curriculum · Mentorship',
    imageSrc: '/images/gufran_faculty.jpeg',
    imageAlt: 'Gufran Chaudhary - Co-Founder & Academic Head',
  },
]

function FounderCard({ founder, index }: { founder: Founder; index: number }) {
  return (
    <div
      className={`
        group relative rounded-3xl bg-white/80 p-6 md:p-8 
        flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8
        shadow-md hover:shadow-xl transition-all duration-300
        border border-white/50 hover:border-amber-200/50
        backdrop-blur-sm hover:-translate-y-1.5
        ${index === 0 ? 'md:pr-10' : 'md:pl-10'}
      `}
    >
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/0 via-amber-400/40 to-amber-400/0 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Photo / Image */}
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-amber-200/40 group-hover:ring-amber-300/60 transition-all duration-300 shadow-md">
            <Image
              src={founder.imageSrc}
              alt={founder.imageAlt}
              width={96}
              height={96}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl -z-10 group-hover:bg-amber-400/20 transition-all duration-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
          <h3 className="text-xl md:text-2xl font-bold text-[#1f1b15] tracking-tight">
            {/* Bold name as in screenshot */}
            <span className="font-extrabold">{founder.name}</span>
          </h3>
          <span className="inline-flex items-center gap-1.5 bg-[#a8324c] text-white text-[10px] md:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {founder.designation}
          </span>
        </div>

        {/* Decorative divider */}
        <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300/50 rounded-full my-2" />

        <p className="text-[#2c2822] text-sm md:text-base leading-relaxed">
          {founder.bio}
          {founder.name === 'Gufran Chaudhary' && (
            <span className="font-bold text-foreground">MBA from Aligarh Muslim University (AMU)</span>
          )}
          {founder.name === 'Gufran Chaudhary' && (
            <span> and is committed to providing structured, quality-driven education.</span>
          )}
          {founder.name === 'Mohammad Shahrukh' && (
            <span> Under his guidance, many students have successfully secured admission to AMU and other reputed universities.</span>
          )}
        </p>

        {founder.extraInfo && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs md:text-sm text-amber-700/80">
            {/* <span className="inline-flex items-center gap-1 bg-amber-50/50 px-2.5 py-1 rounded-full border border-amber-200/30">
              {founder.extraInfo}
            </span> */}
          </div>
        )}
      </div>
    </div>
  )
}

export function FoundersSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Meet the Founders"
        title=""
        description="Two passionate educators, one mission — to transform AMU aspirants into achievers."
      />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {founders.map((founder, index) => (
          <FounderCard key={founder.name} founder={founder} index={index} />
        ))}
      </div>
    </section>
  )
}