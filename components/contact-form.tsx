'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fieldClass =
  'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <h3 className="mt-4 font-heading text-xl font-bold text-card-foreground">
          Thank you for reaching out!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our team will get back to you shortly.
        </p>
        <Button
          className="mt-6 rounded-full font-semibold"
          onClick={() => setSubmitted(false)}
        >
          Send another message
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input id="name" name="name" required className={fieldClass} placeholder="Your name" />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={fieldClass}
            placeholder="+91 ..."
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="course" className="mb-1.5 block text-sm font-medium text-foreground">
            Interested Course
          </label>
          <select id="course" name="course" className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select a course
            </option>
            <option>AMU BA LLB</option>
            <option>AMU BA</option>
            <option>AMU BAFL</option>
            <option>AMU MBA</option>
            <option>Other</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={fieldClass}
            placeholder="How can we help you?"
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full rounded-full font-bold">
        Send Message
      </Button>
    </form>
  )
}
