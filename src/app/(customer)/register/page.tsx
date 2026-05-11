'use client'

import Link from 'next/link'
import { useState } from 'react'

type AccountType = 'athlete' | 'brand' | null

export default function Registration() {
  const [accountType, setAccountType] = useState<AccountType>(null)

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">

          <div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType('athlete')}
                className={`flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wide border transition-colors cursor-pointer ${
                  accountType === 'athlete'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:text-white'
                }`}
              >
                Athlete
              </button>
              <button
                type="button"
                onClick={() => setAccountType('brand')}
                className={`flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wide border transition-colors cursor-pointer ${
                  accountType === 'brand'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:text-white'
                }`}
              >
                Brand
              </button>
            </div>
            <input type="hidden" name="account-type" value={accountType ?? ''} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!accountType}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Already a member?{' '}
          <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
