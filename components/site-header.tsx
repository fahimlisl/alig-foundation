'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NAV, SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [coursesOpen, setCoursesOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label={SITE.name}>
          <span className="relative size-11 overflow-hidden rounded-full ring-1 ring-border lg:size-12">
            <Image
              src={SITE.logo || '/placeholder.svg'}
              alt={`${SITE.name} logo`}
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-base font-extrabold tracking-tight text-foreground lg:text-lg">
              ALIG FOUNDATION
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {SITE.tagline}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:text-foreground',
                    isActive(item.href) ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full w-56 translate-y-1 rounded-xl border border-border bg-popover p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:text-foreground',
                  isActive(item.href) ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-md text-foreground lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.href}>
                  <button
                    type="button"
                    onClick={() => setCoursesOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-base font-semibold text-foreground"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'size-5 transition-transform',
                        coursesOpen && 'rotate-180',
                      )}
                    />
                  </button>
                  {coursesOpen && (
                    <div className="ml-3 flex flex-col border-l border-border pl-3">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground"
                      >
                        All Courses
                      </Link>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-2.5 text-base font-semibold',
                    isActive(item.href) ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Button
              render={<Link href="/admissions" onClick={() => setMobileOpen(false)} />}
              nativeButton={false}
              className="mt-2 rounded-full font-semibold"
              size="lg"
            >
              Student Login
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
