'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/auth-context'

export default function SignInPage() {
  const { signIn, error } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = signIn(email, password)
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
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/join" className="text-zinc-100 underline underline-offset-4 hover:text-white">
              Join now
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="rounded-md border border-red-800/50 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-zinc-300">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-white hover:scale-[1.01] active:scale-[0.99]"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </main>
  )
}
