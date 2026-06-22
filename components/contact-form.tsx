'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fieldClass =
  'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30'

const COURSES = ['AMU BA LLB', 'AMU BA', 'AMU BAFL', 'AMU MBA']

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = String(formData.get('name') || '')
    const phone = String(formData.get('phone') || '')
    const email = String(formData.get('email') || '')
    const course = String(formData.get('course') || '')
    const message = String(formData.get('message') || '')

    setSending(true)
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name,
          from_name: name,
          reply_to: email,
          phone_number: phone,
          interested_course: course,
          message,
        },
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! }
      )

      setSubmitted(true)
      form.reset()
    } catch (err) {
      console.error('failed to send contact form via emailjs', err)
      setError('Something went wrong sending your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

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
            {COURSES.map((c) => (
              <option key={c}>{c}</option>
            ))}
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

      <Button type="submit" size="lg" className="mt-6 w-full rounded-full font-bold" disabled={sending}>
        {sending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  )
}