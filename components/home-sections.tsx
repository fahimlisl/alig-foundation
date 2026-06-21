import { Quote } from 'lucide-react'

const POINTS = [
  {
    lead: 'Personal mentorship',
    rest: " — we don't just teach, we mentor every student individually through their entire preparation journey.",
  },
  {
    lead: '24×7 student support',
    rest: ' — reach your teachers directly, any time you need guidance or your doubts won\'t wait.',
  },
  {
    lead: 'Affordable fees',
    rest: ' — quality coaching priced for every student, not just the ones who can afford it.',
  },
  {
    lead: 'Live interactive classes',
    rest: ' — every session runs live on Google Meet, so you ask, you get answered, instantly.',
  },
  {
    lead: 'Experienced faculty',
    rest: ' — mentors who focus on concept clarity, exam strategy, and your individual growth.',
  },
  {
    lead: 'Comprehensive mock tests',
    rest: ' — tested, analysed, and broken down, so you know exactly where to improve next.',
  },
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

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            For years, we've helped students reach their academic goals through personalized
            support and a student-first approach. Every batch, every doubt, every late-night
            question — someone's actually there.
          </p>

          <div className="mt-8 max-w-3xl text-base leading-loose text-foreground sm:text-lg">
            {POINTS.map((p, i) => (
              <span key={p.lead}>
                <span className="font-heading font-bold text-foreground">{p.lead}</span>
                <span className="text-muted-foreground">{p.rest}</span>
                {i < POINTS.length - 1 && (
                  <span className="mx-2 text-primary/40" aria-hidden="true">
                    &nbsp;—&nbsp;
                  </span>
                )}
              </span>
            ))}
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
  return (
    <div>
      <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="break-inside-avoid rounded-3xl border border-border bg-card p-7"
          >
            <Quote className="size-6 text-primary/60" />

            <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-card-foreground">
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
    </div>
  )
}