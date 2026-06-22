'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const POINTS = [
  'Personal mentorship',
  '24×7 student support',
  'Affordable fees',
  'Live interactive classes',
  'Experienced faculty',
  'Comprehensive mock tests',
]

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
    rank: 'Rank 26 · 13',
  },
  {
    quote:
      'Alhamdulillah, in AMU BA 2026 I have secured 120 in the General Category and Category Rank 22 (CA). I am truly grateful to Alig Foundation for the guidance, mentorship, and continuous support throughout my preparation journey. The dedication of the teachers, their constant motivation, and the student-friendly environment played a very important role in helping me achieve this result. A heartfelt thank you to Shahrukh Sir and Gufran Sir for their support and encouragement.',
    name: 'Nadia Rahim',
    detail: 'AMU BA 2026',
    rank: 'Rank 120 · CA-22',
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
    rank: 'Rank 14 · CE 1 · CA 1',
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
    rank: 'Rank 19 · 7',
  },
  {
    quote:
      "I'm so happy to announce that I've been selected for AMU BA LLB 2026 with Rank 112! This achievement wouldn't have been possible without the guidance and support of Alig Foundation. You always treat us like your little siblings — sharing things that no other coaching centre tells their students. I'm truly grateful that I enrolled here. Thank you, Alig Foundation, and a special thank you to Gufran Sir and Shahrukh Sir.",
    name: 'Vedanti Sanwriya',
    detail: 'AMU BA LLB 2026',
    rank: 'Rank 112',
  },
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
          <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Why students choose us
          </p>

          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            Education here isn't just teaching.{' '}
            <span className="text-primary">It's mentorship that doesn't stop.</span>
          </h2>

          <ul className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span className="font-heading text-base font-bold text-foreground sm:text-lg">
                  {point}
                </span>
              </li>
            ))}
          </ul>

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
                <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
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