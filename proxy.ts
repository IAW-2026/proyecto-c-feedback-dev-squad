import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { prisma } from './lib/prisma'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn, sessionClaims } = await auth()
  const pathname = req.nextUrl.pathname

  if (pathname === '/dashboard' || pathname === '/admin') {
    return Response.redirect(new URL('/', req.url))
  }

  if (!isAuthenticated && isProtectedRoute(req)) {
    return redirectToSignIn()
  }

  if (isAuthenticated && pathname.startsWith('/admin')) {
    const userId = (sessionClaims as any)?.sub
    if (!userId) {
      return Response.redirect(new URL('/?error=no_privileges', req.url))
    }

    try {
      const user = await prisma.usuario.findUnique({ where: { id: userId } })
      if (!user || user.role !== 'admin') {
        return Response.redirect(new URL('/?error=no_privileges', req.url))
      }
    } catch (error) {
      console.error('Error checking admin role:', error)
      return Response.redirect(new URL('/?error=no_privileges', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
