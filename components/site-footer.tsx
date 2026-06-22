'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaTwitter, FaWhatsapp, FaTelegram } from 'react-icons/fa'
import { NAV, SITE } from '@/lib/site'

type Course = { _id: string; title: string }

export function SiteFooter() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/course/fetch-all')
        const data = await res.json()
        if (data.success) {
          setCourses(data.data || [])
        }
      } catch (err) {
        console.error('failed to load courses for footer', err)
      }
    }
    fetchCourses()
  }, [])

  const socials = [
    { label: 'Instagram', href: "https://www.instagram.com/alig_foundation?utm_source=qr&igsh=NWVqZDhtMHo5czBk", Icon: FaInstagram },
    { label: 'Facebook', href: "", Icon: FaFacebook },
    { label: 'WhatsApp', href: "https://whatsapp.com/channel/0029VajUXLL7dmeVGD81gC1U", Icon: FaWhatsapp },
    { label: 'YouTube', href: "https://www.youtube.com/@alig_foundation", Icon: FaYoutube },
    { label: 'LinkedIn', href: "", Icon: FaLinkedin },
    { label: 'Telegram', href: "https://t.me/ALIG_FOUNDATION_MCQ", Icon: FaTelegram },
  ].filter((s) => Boolean(s.href))

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="relative size-11 overflow-hidden rounded-full bg-background">
              <Image
                src={SITE.logo || '/placeholder.svg'}
                alt={`${SITE.name} logo`}
                fill
                sizes="44px"
                className="object-contain"
              />
            </span>
            <div className="leading-none">
              <p className="font-heading text-base font-extrabold">ALIG FOUNDATION</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-background/60">
                {SITE.tagline}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-background/70">
            Helping aspirants crack AMU entrance examinations through expert mentorship,
            structured learning, and consistent practice.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-background/70 transition-colors hover:text-background"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
            Courses
          </h3>
          <ul className="space-y-2.5">
            {courses.length === 0 ? (
              <li className="text-sm text-background/50">No courses yet</li>
            ) : (
              courses.map((c) => (
                <li key={c._id}>
                  <Link
                    href={`/courses/${c._id}`}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {c.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-background/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href={`tel:${SITE.phone}`} className="hover:text-background">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href={`mailto:${SITE.email}`} className="hover:text-background">
                {SITE.email}
              </a>
            </li>
          </ul>

          {socials.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full border border-background/15 text-background/70 transition-colors hover:border-background/30 hover:bg-background/10 hover:text-background"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-5 text-center text-xs text-background/60 sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved. An initiative to
            initiate.
          </p>
          <p>
            Developed and maintained by{' '}
            <a
              href="https://fahim.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-background/80 underline-offset-2 transition-colors hover:text-background hover:underline"
            >
              Fahim Abdullah
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}