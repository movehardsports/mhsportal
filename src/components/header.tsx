'use client'

import Link from 'next/link'
import { useState } from 'react'

type NavChild = { label: string; href: string; description: string }

type NavItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: NavChild[] }

const NAV: NavItem[] = [
  { label: 'CAMPAIGNS', href: '/campaigns' },
  {
    label: 'EXPLORE',
    children: [
      {
        label: 'ATHLETES',
        href: '/explore/athletes',
        description: 'Browse sport athletes available for campaigns and collaborations.',
      },
      {
        label: 'BRANDS',
        href: '/explore/brands',
        description: 'Discover brands looking for athletes to represent them.',
      },
    ],
  },
  { label: 'FOR ATHLETES', href: '/for-athletes' },
  { label: 'FOR BRANDS', href: '/for-brands' },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const closeMenu = () => {
    setMenuOpen(false)
    setOpenDropdown(null)
  }

  const handleDropdownKeyDown = (e: React.KeyboardEvent, label: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpenDropdown((o) => o === label ? null : label)
    }
    if (e.key === 'Escape') setOpenDropdown(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur md:static md:bg-zinc-950 md:backdrop-filter-none">
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
          className="absolute left-1/2 -translate-x-1/2 text-sm font-bold tracking-tight text-zinc-100 shrink-0 md:static md:left-auto md:translate-x-0"
        >
          MHS
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-8">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === item.label}
                  className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-100 cursor-pointer"
                  onKeyDown={(e) => handleDropdownKeyDown(e, item.label)}
                >
                  {item.label}
                  <Chevron open={openDropdown === item.label} />
                </button>

                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-3">
                    <div className="grid grid-cols-2 gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl shadow-black/40 w-96">
                      {item.children.map(({ label, href, description }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex flex-col gap-1 rounded-lg p-4 transition-colors hover:bg-zinc-800/60"
                        >
                          <span className="text-sm font-medium text-zinc-100">{label}</span>
                          <span className="text-xs text-zinc-500 leading-relaxed">{description}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.label} href={item.href} className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Link href="/sign-in" className="rounded-full px-4 py-1.5 text-sm text-zinc-300 transition-colors hover:text-zinc-100">
            SIGN IN
          </Link>
          <Link href="/join" className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white">
            JOIN
          </Link>
        </div>

        <div className="w-7 md:hidden ml-auto" aria-hidden="true" />

      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full border-t border-zinc-800 bg-zinc-950 px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100"
                    onClick={() => setOpenDropdown((o) => o === item.label ? null : item.label)}
                  >
                    {item.label}
                    <Chevron open={openDropdown === item.label} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-zinc-800 pl-3">
                      {item.children.map(({ label, href }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={closeMenu}
                          className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.label} href={item.href} onClick={closeMenu} className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100">
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-2 flex flex-col gap-2 border-t border-zinc-800 pt-2">
              <Link href="/sign-in" onClick={closeMenu} className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100">
                SIGN IN
              </Link>
              <Link href="/join" onClick={closeMenu} className="rounded-lg bg-zinc-100 px-3 py-2 text-center text-sm font-medium text-zinc-950 hover:bg-white">
                JOIN
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
