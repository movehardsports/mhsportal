'use client'

import { Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import type { User } from '@supabase/supabase-js'

type NavItem = { name: string; href?: string; children?: { name: string; href: string }[] }

type HeaderProps = {
  navigation: NavItem[]
  user?: User | null
  showSignOut?: boolean
  showHome?: boolean
}

export default function Header({ navigation, user, showSignOut, showHome }: HeaderProps) {
  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-1 items-center">
                {navigation.map((item) =>
                  item.children ? (
                    <Popover key={item.name} className="relative">
                      <PopoverButton className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white focus:outline-none data-open:bg-white/5 data-open:text-white">
                        {item.name}
                        <ChevronDownIcon className="size-3.5 transition-transform duration-150 data-open:rotate-180" aria-hidden="true" />
                      </PopoverButton>
                      <PopoverPanel
                        anchor="bottom start"
                        className="z-10 mt-1 w-40 rounded-lg border border-white/10 bg-gray-900 py-1 shadow-xl"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </PopoverPanel>
                    </Popover>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href ?? '#'}
                      className="rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 hidden sm:flex items-center gap-4 sm:static sm:inset-auto sm:ml-6">
            {showSignOut ? (
              <>
                <Link
                  href={showHome ? '/' : '/dashboard'}
                  className="text-gray-300 hover:text-white text-sm font-medium uppercase tracking-wide transition-colors"
                >
                  {showHome ? 'HOME' : 'DASHBOARD'}
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="text-gray-300 hover:text-white text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer"
                  >
                    SIGN OUT
                  </button>
                </form>
              </>
            ) : user ? (
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white text-sm font-medium uppercase tracking-wide transition-colors"
              >
                DASHBOARD
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white text-sm font-medium uppercase tracking-wide transition-colors"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-gray-200 transition-colors"
                >
                  JOIN
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.name}>
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {item.name}
                </p>
                {item.children.map((child) => (
                  <DisclosureButton
                    key={child.name}
                    as={Link}
                    href={child.href}
                    className="block rounded-md px-5 py-2 text-base font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    {child.name}
                  </DisclosureButton>
                ))}
              </div>
            ) : (
              <DisclosureButton
                key={item.name}
                as={Link}
                href={item.href ?? '#'}
                className="block rounded-md px-3 py-2 text-base font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white"
              >
                {item.name}
              </DisclosureButton>
            )
          )}
          <div className="border-t border-white/10 mt-2 pt-2 space-y-1">
            {showSignOut ? (
              <>
                <Link
                  href={showHome ? '/' : '/dashboard'}
                  className="block rounded-md px-3 py-2 text-base font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  {showHome ? 'HOME' : 'DASHBOARD'}
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer"
                  >
                    SIGN OUT
                  </button>
                </form>
              </>
            ) : user ? (
              <Link
                href="/dashboard"
                className="block rounded-md px-3 py-2 text-base font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white"
              >
                DASHBOARD
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  className="block rounded-md px-3 py-2 text-base font-medium uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  JOIN
                </Link>
              </>
            )}
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
