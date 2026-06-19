'use client'

import { useState } from 'react'
import { Award, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fieldClass =
  'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30'

type ResultData = {
  name: string
  course: string
  marks: string
  percentile: string
  rank: string
  status: string
}

export function ResultLookup() {
  const [roll, setRoll] = useState('')
  const [result, setResult] = useState<ResultData | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roll.trim()) return
    // Demo data — replace with real lookup
    setResult({
      name: 'Areeb Khan',
      course: 'AMU BA LLB Entrance 2024',
      marks: '182 / 200',
      percentile: '99.4',
      rank: 'AIR 4',
      status: 'Qualified',
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-xl font-bold text-card-foreground">
        Check Your Result
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your roll number / registration ID to view your result.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          className={fieldClass}
          placeholder="e.g. ALIG2024001"
          aria-label="Roll number"
        />
        <Button type="submit" size="lg" className="rounded-full px-6 font-bold">
          <Search className="size-4" />
          Check
        </Button>
      </form>

      {result && (
        <div className="mt-6 rounded-2xl border border-primary/40 bg-accent/40 p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Award className="size-6" />
            </span>
            <div>
              <p className="font-heading text-lg font-bold text-foreground">
                {result.name}
              </p>
              <p className="text-sm text-muted-foreground">{result.course}</p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ['Marks', result.marks],
              ['Percentile', result.percentile],
              ['Rank', result.rank],
              ['Status', result.status],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-card p-4 text-center">
                <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-heading text-base font-extrabold text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}
