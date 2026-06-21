'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Topper = {
  name: string
  rank: string
  exam: string
  batch: string
  photo?: string
}

export const TOPPERS: Topper[] = [
  {
    name: 'Mujahid Alam',
    rank: '1 (BC)',
    exam: 'AMU B.A. (Hons)',
    batch: 'Batch 2.0 (2024)',
    photo: '/images/topper-mujahid.jpeg',
  },
  {
    name: 'Vedanti Sanwariya',
    rank: '1 (SC)',
    exam: 'AMU B.A. (Hons)',
    batch: 'Batch 4.0 (2026)',
    photo: '/images/topper-vedanti.jpeg',
  },
  {
    name: 'Mohd Nazaq',
    rank: '1 (ST)',
    exam: 'AMU BA LLB',
    batch: 'Batch 4.0 (2026)',
    photo: '/images/topper-nazaq.jpeg',
  },
  {
    name: 'Khadija Khan',
    rank: '1 (CE/CA)',
    exam: 'AMU BA LLB',
    batch: 'Batch 4.0 (2026)',
    photo: '/images/topper-khadija.jpeg',
  },
  {
    name: 'Anamta Husain',
    rank: '1 (GEN)',
    exam: 'AMU B.A. (Hons)',
    batch: 'Batch 1.0 (2023)',
  },
  {
    name: 'Yasmeen Parween',
    rank: '1 (PH)',
    exam: 'AMU B.A. (Hons)',
    batch: 'Batch 3.0 (2025)',
  },
  {
    name: 'Mizba Gouri',
    rank: '1 (PH)',
    exam: 'AMU B.A. (Hons)',
    batch: 'Batch 2.0 (2024)',
  },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ToppersCarousel({ toppers = TOPPERS }: { toppers?: Topper[] }) {
  const [start, setStart] = useState(0)
  const perView = 2
  const maxStart = Math.max(0, toppers.length - perView)

  const prev = () => setStart((s) => (s <= 0 ? maxStart : s - 1))
  const next = () => setStart((s) => (s >= maxStart ? 0 : s + 1))

  const visible = [toppers[start % toppers.length], toppers[(start + 1) % toppers.length]]

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous toppers"
          className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-background/70 text-foreground shadow-sm transition hover:bg-background sm:flex"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="flex flex-col items-center rounded-2xl bg-card p-4 shadow-lg"
            >
              <div className="flex w-full items-start justify-between">
                <div className="leading-none">
                  <p className="text-xs font-bold text-muted-foreground">RANK</p>
                  <p className="font-heading text-2xl font-extrabold text-primary sm:text-2xl">
                    {t.rank}
                    <span className="align-super text-base">*</span>
                  </p>
                </div>
              </div>

              <div className="relative my-2 aspect-square w-32 overflow-hidden rounded-full ring-4 ring-accent sm:w-36">
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={`${t.name}, Rank ${t.rank}`}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-secondary">
                    <span className="font-heading text-3xl font-extrabold text-muted-foreground sm:text-4xl">
                      {getInitials(t.name)}
                    </span>
                  </div>
                )}
              </div>

              <span className="rounded-full bg-[#1e3a8a] px-5 py-1.5 text-sm font-bold uppercase tracking-wide text-white">
                {t.name}
              </span>
              <p className="mt-3 text-center text-xs font-bold uppercase tracking-wide text-card-foreground">
                {t.exam}
              </p>
              <p className="mt-0.5 text-center text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                {t.batch}
              </p>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next toppers"
          className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-background/70 text-foreground shadow-sm transition hover:bg-background sm:flex"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {toppers.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to topper ${i + 1}`}
            onClick={() => setStart(Math.min(i, maxStart))}
            className={cn(
              'h-2 rounded-full transition-all',
              i === start ? 'w-6 bg-foreground' : 'w-2 bg-foreground/30',
            )}
          />
        ))}
      </div>
    </div>
  )
}