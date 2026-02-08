'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APP_NAME } from '@/constants/config'

const navLinks = [
  { href: '/', label: 'Upload' },
  { href: '/compare', label: 'Compare' },
] as const

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-[60px] max-w-5xl items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold">
            ⇋
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-foreground'
                    : 'text-zinc-400 hover:bg-white/[0.05] hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
