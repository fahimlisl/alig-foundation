'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fieldClass =
  'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30'
const labelClass = 'mb-1.5 block text-sm font-medium text-foreground'

export function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <h3 className="mt-4 font-heading text-xl font-bold text-card-foreground">
          Registration submitted!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thank you for registering with Alig Foundation. Our admissions team will contact
          you shortly to complete your enrolment.
        </p>
        <Button
          className="mt-6 rounded-full font-semibold"
          onClick={() => setSubmitted(false)}
        >
          Register another student
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="font-heading text-xl font-bold text-card-foreground">
        Registration Form
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Fill in your details to register. Fields marked with * are required.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fname" className={labelClass}>
            First Name *
          </label>
          <input id="fname" required className={fieldClass} placeholder="First name" />
        </div>
        <div>
          <label htmlFor="lname" className={labelClass}>
            Last Name *
          </label>
          <input id="lname" required className={fieldClass} placeholder="Last name" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone *
          </label>
          <input
            id="phone"
            type="tel"
            required
            className={fieldClass}
            placeholder="+91 ..."
          />
        </div>
        <div>
          <label htmlFor="course" className={labelClass}>
            Course *
          </label>
          <select id="course" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select a course
            </option>
            <option>AMU BA LLB</option>
            <option>AMU BA</option>
            <option>AMU BAFL</option>
            <option>AMU MBA</option>
          </select>
        </div>
        <div>
          <label htmlFor="mode" className={labelClass}>
            Preferred Mode *
          </label>
          <select id="mode" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select mode
            </option>
            <option>Online</option>
            <option>Offline (Classroom)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="city" className={labelClass}>
            City
          </label>
          <input id="city" className={fieldClass} placeholder="Your city" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className={labelClass}>
            Message (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            className={fieldClass}
            placeholder="Anything you'd like us to know"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full rounded-full font-bold">
        Submit Registration
      </Button>
    </form>
  )
}
