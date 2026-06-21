'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'

type ResultPoster = {
  src: string
  year: string
  exam: string
}

// adjust these src paths to wherever you actually place the images in /public
const POSTERS: ResultPoster[] = [
  { src: '/results/amu-ba-hons-2025.jpeg', year: '2025', exam: 'BA (Hons) Entrance' },
  { src: '/results/amu-ba-llb-2025.jpeg', year: '2025', exam: 'BA LL.B Entrance' },
  { src: '/results/amu-ba-hons-2024.jpeg', year: '2024', exam: 'BA (Hons) Entrance' },
  { src: '/results/amu-ba-llb-2024.jpeg', year: '2024', exam: 'BA LL.B Entrance' },
  { src: '/results/amu-ba-hons-2023.jpeg', year: '2023', exam: 'BA (Hons) Entrance' },
  { src: '/results/amu-ba-llb-2023.jpeg', year: '2023', exam: 'BA LL.B (Hons) Entrance' },
]

const YEARS = ['All', '2025', '2024', '2023']

export default function ResultPage() {
  const [activeYear, setActiveYear] = useState('All')
  const [lightbox, setLightbox] = useState<ResultPoster | null>(null)

  const filtered =
    activeYear === 'All' ? POSTERS : POSTERS.filter((p) => p.year === activeYear)

  return (
    <>
      <PageHero
        title="Results"
        subtitle="Check your entrance result and celebrate the achievements of our top performers."
      />

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Hall of Fame"
            title="Our Selected Students"
            description="Official result sheets, straight from the source."
          />

          {/* year filter */}
          <div className="mt-8 flex justify-center gap-2 sm:justify-start">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setActiveYear(y)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  activeYear === y
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card text-muted-foreground hover:bg-secondary'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((poster, i) => (
              <button
                key={`${poster.src}-${i}`}
                onClick={() => setLightbox(poster)}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                  <Image
                    src={poster.src}
                    alt={`${poster.exam} ${poster.year} result`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-heading text-sm font-bold text-card-foreground">
                      {poster.exam}
                    </p>
                    <p className="text-xs text-muted-foreground">{poster.year}</p>
                  </div>
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                    View
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={`${lightbox.exam} ${lightbox.year} result`}
              width={1080}
              height={1400}
              className="h-auto w-full"
            />
          </div>
        </div>
      )}
    </>
  )
}