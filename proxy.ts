import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from './lib/prisma'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/admin(.*)', '/explorar(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn, sessionClaims } = await auth()
  const pathname = req.nextUrl.pathname

  const hasToken = !!req.nextUrl.searchParams.get('token')
  const isPublicResourcePath =
    pathname.startsWith('/explorar/producto/') ||
    pathname.startsWith('/explorar/vendedor/') ||
    pathname === '/dashboard/crear-resena'

  if (isPublicResourcePath && hasToken) {
    return NextResponse.next()
  }

  if (!isAuthenticated && isProtectedRoute(req)) {
    return redirectToSignIn()
  }

  if (pathname === '/dashboard') {
    return Response.redirect(new URL('/dashboard/mis-resenas', req.url))
  }
  if (pathname === '/admin') {
    return Response.redirect(new URL('/admin/reportes', req.url))
  }

  if (isAuthenticated && pathname.startsWith('/admin')) {
    const userId = (sessionClaims as any)?.sub
    if (!userId) {
      return Response.redirect(new URL('/?error=no_privileges', req.url))
    }

    try {
      const user = await prisma.usuario.findUnique({ where: { id: userId } })

      if (user && user.rol.toLowerCase() === 'admin') {
        return
      }

      const clerkRole = (sessionClaims as any)?.public_metadata?.role
      if (clerkRole?.toLowerCase() === 'admin') {
        await prisma.usuario.upsert({
          where: { id: userId },
          update: { rol: 'admin' },
          create: { id: userId, nombre: 'Admin', rol: 'admin' },
        })
        return
      }

      return Response.redirect(new URL('/?error=no_privileges', req.url))
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
