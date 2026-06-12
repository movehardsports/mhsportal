'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import type { Role } from '@/lib/local-auth'

export default function JoinPage() {
  const { signUp, error } = useAuth()
  const router = useRouter()
  const [role, setRole] = useState<Role>('athlete')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = signUp({ email, password, name, role })
    if (ok) router.push('/')
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-bold tracking-tight text-zinc-100">
            MHS
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-100">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-zinc-100 underline underline-offset-4 hover:text-white">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          {(['athlete', 'brand'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-md py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                role === r
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {r === 'athlete' ? 'Athlete' : 'Brand'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="rounded-md border border-red-800/50 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {role === 'athlete' ? 'Full name' : 'Brand name'}
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'athlete' ? 'Jane Smith' : 'Acme Sports'}
              className="rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="min. 8 characters"
              className="rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-white hover:scale-[1.01] active:scale-[0.99]"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-600">
          By joining you agree to our{' '}
          <Link href="/terms" className="text-zinc-500 underline underline-offset-2 hover:text-zinc-300">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-zinc-500 underline underline-offset-2 hover:text-zinc-300">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
