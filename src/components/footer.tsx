import Link from 'next/link'

const COLUMNS = [
  {
    heading: 'Discover',
    links: [
      { label: 'Campaigns', href: '/campaigns' },
      { label: 'Athletes', href: '/explore/athletes' },
      { label: 'Brands', href: '/explore/brands' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto w-full max-w-7xl space-y-3 px-4 pb-4 pt-8 sm:px-6">

        {/* Nav + socials */}
        <div className="rounded-md border border-zinc-800/60 px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="grid grid-cols-3 gap-6 sm:flex sm:gap-14">
              {COLUMNS.map(({ heading, links }) => (
                <div key={heading} className="space-y-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{heading}</p>
                  <nav className="flex flex-col gap-2.5">
                    {links.map(({ label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:shrink-0">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
              >
                IG
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
              >
                YT
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="rounded-md border border-zinc-800/60 py-4 text-center">
          <p className="text-xs text-zinc-600">© 2026 MHS. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}
