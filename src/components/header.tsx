'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'CAMPAIGNS', href: '/campaigns' },
  { label: 'EXPLORE', href: '/explore' },
  { label: 'FOR ATHLETES', href: '/for-athletes' },
  { label: 'FOR BRANDS', href: '/for-brands' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">

        <button
          type="button"
          className="flex flex-col gap-1.5 p-1 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`h-0.5 w-5 bg-zinc-400 transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-5 bg-zinc-400 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-5 bg-zinc-400 transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>

        <Link
          href="/"
          className="text-sm font-bold tracking-tight text-zinc-100 shrink-0 absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0"
        >
          MHS
        </Link>

        <nav className="hidden items-center gap-6 md:flex ml-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex ml-auto">
          <Link
            href="/sign-in"
            className="rounded-full px-4 py-1.5 text-sm text-zinc-300 transition-colors hover:text-zinc-100"
          >
            SIGN IN
          </Link>
          <Link
            href="/join"
            className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
          >
            JOIN
          </Link>
        </div>

        <div className="w-7 md:hidden ml-auto" aria-hidden="true" />

      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full border-t border-zinc-800 bg-zinc-950 px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-zinc-800 pt-2">
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
              >
                SIGN IN
              </Link>
              <Link
                href="/join"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-zinc-100 px-3 py-2 text-center text-sm font-medium text-zinc-950 hover:bg-white"
              >
                JOIN
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
