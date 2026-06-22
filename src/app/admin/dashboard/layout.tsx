'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, GraduationCap, Settings, KeyRound, LogOut, Loader2 } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch (err) {
      console.error('logout failed', err)
    } finally {
      router.push('/admin/auth')
      router.refresh()
    }
  }

  const isApplicants = pathname === '/admin/dashboard'
  const isCourses = pathname.startsWith('/admin/dashboard/courses')
  const isAdmissionSettings = pathname.startsWith('/admin/dashboard/admission-settings')
  const isChangePassword = pathname.startsWith('/admin/dashboard/change-password')

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-lg font-bold text-card-foreground">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard/change-password"
              title="Change Password"
              aria-current={isChangePassword ? 'page' : undefined}
              className={`flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors ${
                isChangePassword
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <KeyRound className="size-4" />
              <span className="hidden sm:inline">Password</span>
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-60"
            >
              {loggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-2 rounded-xl border border-border bg-card p-1.5 sm:w-fit">
          <NavTab href="/admin/dashboard" active={isApplicants} icon={Users} label="Applicants" />
          <NavTab href="/admin/dashboard/courses" active={isCourses} icon={GraduationCap} label="Courses" />
          <NavTab
            href="/admin/dashboard/admission-settings"
            active={isAdmissionSettings}
            icon={Settings}
            label="Admissions"
          />
        </div>

        {children}
      </div>
    </div>
  )
}

function NavTab({
  href,
  active,
  icon: Icon,
  label,
}: {
  href: string
  active: boolean
  icon: typeof Users
  label: string
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
      }`}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  )
}