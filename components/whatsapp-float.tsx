'use client'

import { usePathname } from 'next/navigation'

const WHATSAPP_NUMBER = '917465008633'

export function WhatsAppFloat() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 sm:bottom-6 sm:right-6"
    >
      <svg
        viewBox="0 0 32 32"
        className="size-8"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.39.706 4.612 1.918 6.476L4 29l7.738-1.879A11.95 11.95 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.78 9.78 0 0 1-4.99-1.367l-.357-.213-4.594 1.115 1.13-4.481-.234-.367A9.77 9.77 0 0 1 5.273 15c0-5.918 4.813-10.727 10.731-10.727 5.917 0 10.727 4.81 10.727 10.727 0 5.918-4.81 10.727-10.727 10.727Zm5.892-8.043c-.323-.162-1.91-.943-2.207-1.05-.297-.108-.512-.162-.728.162-.215.323-.834 1.05-1.022 1.265-.188.215-.377.242-.7.081-.323-.162-1.365-.503-2.6-1.605-.96-.857-1.61-1.918-1.798-2.241-.188-.323-.02-.498.162-.66.162-.146.323-.377.485-.566.162-.188.215-.323.323-.539.108-.215.054-.404-.027-.566-.081-.162-.728-1.752-.998-2.4-.27-.647-.539-.566-.728-.566-.188 0-.404-.014-.62-.014-.215 0-.566.081-.862.404-.297.323-1.135 1.11-1.135 2.7 0 1.59 1.157 3.127 1.318 3.342.162.215 2.207 3.382 5.353 4.604 3.146 1.223 3.146.81 3.713.756.566-.054 1.91-.78 2.18-1.535.27-.755.27-1.401.188-1.535-.081-.135-.297-.215-.62-.377Z" />
      </svg>
    </a>
  )
}