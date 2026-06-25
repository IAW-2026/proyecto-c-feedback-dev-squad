import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { resolveTargetName } from '../../../../services/db'
import TargetReviews from '../../../../components/TargetReviews'
import ThemeLink from '../../../../components/ThemeLink'
import { verifyToken } from '../../../../lib/handoffToken'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { targetName } = await resolveTargetName('seller', id)
  return { title: `${targetName} - Reseñas`, description: `Reseñas de ${targetName}` }
}

export default async function VendedorReviewsPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const { userId: clerkUserId } = await auth()
  const { targetName } = await resolveTargetName('seller', id)

  let tokenUserId: string | null = null
  if (!clerkUserId && sp?.token) {
    tokenUserId = (
      await verifyToken(process.env.BUYER_APP_SELLER_KEY!, sp.token as string, id)
      ?? await verifyToken(process.env.API_KEY_SELLER_APP!, sp.token as string, id)
    )?.userId ?? null
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-4">
          {tokenUserId ? (
            <ThemeLink
              href="https://zapasya.vercel.app/home"
              aria-label="Ir a la app de compradores"
              className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-1.5 border border-gray-300 shadow-sm sm:shadow-none dark:border-gray-600 rounded-full sm:rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="sm:hidden text-xs">Comprar</span><span className="hidden sm:inline">Ir a la app de compradores</span>
            </ThemeLink>
          ) : (
            <Link
              href="/explorar"
              aria-label="Volver a explorar"
              className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-1.5 border border-gray-300 shadow-sm sm:shadow-none dark:border-gray-600 rounded-full sm:rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span className="sm:hidden text-xs">Explorar</span><span className="hidden sm:inline">Volver a explorar</span>
            </Link>
          )}
          <ThemeLink
            href="https://proyecto-c-seller-dev-squad.vercel.app/dashboard/reviews"
            aria-label="Ir a la app de vendedores"
            className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-1.5 border border-gray-300 shadow-sm sm:shadow-none dark:border-gray-600 rounded-full sm:rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
            <span className="sm:hidden text-xs">Vender</span><span className="hidden sm:inline">Ir a la app de vendedores</span>
          </ThemeLink>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {targetName}
        </h1>
        <TargetReviews targetId={id} tipo="seller" targetName={targetName} tokenUserId={tokenUserId} token={sp?.token ? (sp.token as string) : undefined} />
      </div>
    </main>
  )
}
