import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const AUTH_ROUTES = ['/login', '/register']
const DASHBOARD_ROUTES = ['/dashboard']

export async function proxy(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request)

  if (user && AUTH_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (user && DASHBOARD_ROUTES.some(r => request.nextUrl.pathname.startsWith(r))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (!profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
