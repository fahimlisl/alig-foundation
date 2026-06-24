
// 'use client'
// import { useState, useEffect } from 'react'
// import Image from 'next/image'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
// import { cn } from '@/lib/utils'

// export type Topper = {
//   name: string
//   rank: string
//   exam: string
//   batch: string
//   photo?: string
// }

// export const TOPPERS: Topper[] = [
//   {
//     name: 'Mujahid Alam',
//     rank: '1 (BC)',
//     exam: 'AMU B.A. (Hons)',
//     batch: 'Batch 2.0 (2024)',
//     photo: '/images/topper-mujahid.jpeg',
//   },
//   {
//     name: 'Vedanti Sanwariya',
//     rank: '1 (SC)',
//     exam: 'AMU B.A. (Hons)',
//     batch: 'Batch 4.0 (2026)',
//     photo: '/images/topper-vedanti.jpeg',
//   },
//   {
//     name: 'Mohd Nazaq',
//     rank: '1 (ST)',
//     exam: 'AMU BA LLB',
//     batch: 'Batch 4.0 (2026)',
//     photo: '/images/topper-nazaq.jpeg',
//   },
//   {
//     name: 'Khadija Khan',
//     rank: '1 (CE/CA)',
//     exam: 'AMU BA LLB',
//     batch: 'Batch 4.0 (2026)',
//     photo: '/images/topper-khadija.jpeg',
//   },
//   {
//     name: 'Anamta Husain',
//     rank: '1 (GEN)',
//     exam: 'AMU B.A. (Hons)',
//     batch: 'Batch 1.0 (2023)',
//   },
//   {
//     name: 'Yasmeen Parween',
//     rank: '1 (PH)',
//     exam: 'AMU B.A. (Hons)',
//     batch: 'Batch 3.0 (2025)',
//   },
//   {
//     name: 'Mizba Gouri',
//     rank: '1 (PH)',
//     exam: 'AMU B.A. (Hons)',
//     batch: 'Batch 2.0 (2024)',
//   },
// ]

// function getInitials(name: string) {
//   return name
//     .split(' ')
//     .map((w) => w[0])
//     .slice(0, 2)
//     .join('')
//     .toUpperCase()
// }

// export function ToppersCarousel({ toppers = TOPPERS }: { toppers?: Topper[] }) {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [isTransitioning, setIsTransitioning] = useState(false)
//   const [perView, setPerView] = useState(2)

//   useEffect(() => {
//     const updatePerView = () => {
//       setPerView(window.innerWidth < 640 ? 1 : 2)
//     }
    
//     updatePerView()
//     window.addEventListener('resize', updatePerView)
//     return () => window.removeEventListener('resize', updatePerView)
//   }, [])

//   const totalSlides = Math.ceil(toppers.length / perView)
//   const currentSlide = Math.floor(currentIndex / perView)

//   const goToSlide = (slideIndex: number) => {
//     if (isTransitioning) return
//     setIsTransitioning(true)
//     setCurrentIndex(slideIndex * perView)
//     setTimeout(() => setIsTransitioning(false), 500)
//   }

//   const prev = () => {
//     if (isTransitioning) return
//     const newSlide = currentSlide <= 0 ? totalSlides - 1 : currentSlide - 1
//     goToSlide(newSlide)
//   }

//   const next = () => {
//     if (isTransitioning) return
//     const newSlide = currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1
//     goToSlide(newSlide)
//   }

//   return (
//     <div className="w-full">
//       <div className="relative">
//         <button
//           type="button"
//           onClick={prev}
//           aria-label="Previous toppers"
//           className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 size-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white sm:flex"
//         >
//           <ChevronLeft className="size-5" />
//         </button>

//         <button
//           type="button"
//           onClick={next}
//           aria-label="Next toppers"
//           className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 size-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white sm:flex"
//         >
//           <ChevronRight className="size-5" />
//         </button>

//         {/* Carousel Container */}
//         <div className="overflow-hidden">
//           <div
//             className="flex transition-transform duration-500 ease-in-out"
//             style={{
//               transform: `translateX(-${currentSlide * 100}%)`,
//             }}
//           >
//             {Array.from({ length: totalSlides }).map((_, slideIndex) => (
//               <div
//                 key={slideIndex}
//                 className="min-w-full grid grid-cols-1 gap-4 sm:grid-cols-2"
//               >
//                 {toppers
//                   .slice(slideIndex * perView, slideIndex * perView + perView)
//                   .map((t) => (
//                     <article
//                       key={t.name}
//                       className="flex flex-col items-center rounded-2xl bg-card p-4 shadow-lg"
//                     >
//                       <div className="flex w-full items-start justify-between">
//                         <div className="leading-none">
//                           <p className="text-xs font-bold text-muted-foreground">RANK</p>
//                           <p className="font-heading text-2xl font-extrabold text-primary sm:text-2xl">
//                             {t.rank}
//                             <span className="align-super text-base">*</span>
//                           </p>
//                         </div>
//                       </div>

//                       <div className="relative my-2 aspect-square w-32 overflow-hidden rounded-full ring-4 ring-accent sm:w-36">
//                         {t.photo ? (
//                           <Image
//                             src={t.photo}
//                             alt={`${t.name}, Rank ${t.rank}`}
//                             fill
//                             sizes="144px"
//                             className="object-cover"
//                           />
//                         ) : (
//                           <div className="flex size-full items-center justify-center bg-secondary">
//                             <span className="font-heading text-3xl font-extrabold text-muted-foreground sm:text-4xl">
//                               {getInitials(t.name)}
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       <span className="rounded-full bg-[#1e3a8a] px-5 py-1.5 text-sm font-bold uppercase tracking-wide text-white">
//                         {t.name}
//                       </span>
//                       <p className="mt-3 text-center text-xs font-bold uppercase tracking-wide text-card-foreground">
//                         {t.exam}
//                       </p>
//                       <p className="mt-0.5 text-center text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
//                         {t.batch}
//                       </p>
//                     </article>
//                   ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mt-5 flex items-center justify-center gap-2">
//         {Array.from({ length: totalSlides }).map((_, i) => (
//           <button
//             key={i}
//             type="button"
//             aria-label={`Go to slide ${i + 1}`}
//             onClick={() => goToSlide(i)}
//             className={cn(
//               'h-2 rounded-full transition-all',
//               currentSlide === i ? 'w-6 bg-foreground' : 'w-2 bg-foreground/30',
//             )}
//           />
//         ))}
//       </div>
//       <div className="mt-4 flex items-center justify-center gap-6 sm:hidden">
//         <button
//           type="button"
//           onClick={prev}
//           aria-label="Previous toppers"
//           className="size-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white flex"
//         >
//           <ChevronLeft className="size-5" />
//         </button>
//         <span className="text-sm font-medium text-white/70">
//           {currentSlide + 1} / {totalSlides}
//         </span>
//         <button
//           type="button"
//           onClick={next}
//           aria-label="Next toppers"
//           className="size-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white flex"
//         >
//           <ChevronRight className="size-5" />
//         </button>
//       </div>
//     </div>
//   )
// }


'use client'
import { useState, useEffect } from 'react'
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
    name: 'Khadija Khan',
    rank: '14',
    exam: 'AMU BA LLB',
    batch: 'Batch 4.0 (2026)',
    photo: '/images/toppers/topper-khadija.jpeg',
  },
  {
    name: 'Asaf Shad',
    rank: '41',
    exam: 'AMU BA LLB',
    batch: 'Batch 2.0 (2024)',
    photo: '/images/toppers/topper-asaf.jpeg',
  },
  {
    name: 'Naba Amir',
    rank: '42',
    exam: 'AMU BA LLB',
    batch: 'Batch 3.0 (2025)',
    photo: '/images/toppers/topper-naba.jpeg',
  },
  {
    name: 'Mohd Nazaq',
    rank: '55',
    exam: 'AMU BA LLB',
    batch: 'Batch 4.0 (2026)',
    photo: '/images/toppers/topper-nazaq.jpeg',
  },
  {
    name: 'Mohammad Sohail',
    rank: '59',
    exam: 'AMU BA LLB',
    batch: 'Batch 3.0 (2025)',
    photo: '/images/toppers/topper-sohail.jpeg',
  },
  {
    name: 'Zeba Parween',
    rank: '73',
    exam: 'AMU BA LLB',
    batch: 'Batch 4.0 (2026)',
    photo: '/images/toppers/topper-zeba.jpeg',
  },
  {
    name: 'Rishabh Kumar',
    rank: '74',
    exam: 'AMU BA LLB',
    batch: 'Batch 3.0 (2025)',
    photo: '/images/toppers/topper-rishabh.jpeg',
  },
  {
    name: 'Quazi Razaul Mustafa',
    rank: '83',
    exam: 'AMU BA LLB',
    batch: 'Batch 1.0 (2023)',
  },
  {
    name: 'Md Farhan Arzoo',
    rank: '89',
    exam: 'AMU BA LLB',
    batch: 'Batch 2.0 (2024)',
    photo: '/images/toppers/topper-farhan.jpeg',
  },
  {
    name: 'Suhaliya Muhammad',
    rank: '90',
    exam: 'AMU BA LLB',
    batch: 'Batch 4.0 (2026)',
    photo: '/images/toppers/topper-suhaliya.jpeg',
  },
  {
    name: 'Md Faizan E Mustafa',
    rank: '97',
    exam: 'AMU BA LLB',
    batch: 'Batch 4.0 (2026)',
    photo: '/images/toppers/topper-faizan.jpeg',
  },
  {
    name: 'Nibras Ahmed',
    rank: '99',
    exam: 'AMU BA LLB',
    batch: 'Batch 3.0 (2025)',
    photo: '/images/toppers/topper-nibras.jpeg',
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [perView, setPerView] = useState(2)

  useEffect(() => {
    const updatePerView = () => {
      setPerView(window.innerWidth < 640 ? 1 : 2)
    }
    
    updatePerView()
    window.addEventListener('resize', updatePerView)
    return () => window.removeEventListener('resize', updatePerView)
  }, [])

  const totalSlides = Math.ceil(toppers.length / perView)
  const currentSlide = Math.floor(currentIndex / perView)

  const goToSlide = (slideIndex: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(slideIndex * perView)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prev = () => {
    if (isTransitioning) return
    const newSlide = currentSlide <= 0 ? totalSlides - 1 : currentSlide - 1
    goToSlide(newSlide)
  }

  const next = () => {
    if (isTransitioning) return
    const newSlide = currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1
    goToSlide(newSlide)
  }

  return (
    <div className="w-full">
      <div className="relative">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous toppers"
          className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 size-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white sm:flex"
        >
          <ChevronLeft className="size-5" />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next toppers"
          className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 size-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white sm:flex"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="min-w-full grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {toppers
                  .slice(slideIndex * perView, slideIndex * perView + perView)
                  .map((t) => (
                    <article
                      key={t.name}
                      className="flex flex-col items-center rounded-2xl bg-card p-4 shadow-lg"
                    >
                      <div className="flex w-full items-start justify-between">
                        <div className="leading-none">
                          <p className="text-xs font-bold text-muted-foreground">RANK</p>
                          <p className="font-heading text-2xl font-extrabold text-primary sm:text-2xl">
                            {t.rank}
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
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goToSlide(i)}
            className={cn(
              'h-2 rounded-full transition-all',
              currentSlide === i ? 'w-6 bg-foreground' : 'w-2 bg-foreground/30',
            )}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 sm:hidden">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous toppers"
          className="size-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white flex"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="text-sm font-medium text-white/70">
          {currentSlide + 1} / {totalSlides}
        </span>
        <button
          type="button"
          onClick={next}
          aria-label="Next toppers"
          className="size-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white flex"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  )
}