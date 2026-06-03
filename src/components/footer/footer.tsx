import Link from "next/link";

const columns = [
  {
    title: 'Discover',
    links: [
      { name: 'Campaigns', href: '/campaigns' },
      { name: 'Athletes', href: '/explore/athletes' },
      { name: 'Brands', href: '/explore/brands' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800/50 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-20 mb-10">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-4">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-gray-500">© 2025 MHS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
