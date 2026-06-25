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
  const { targetName } = await resolveTargetName('product', id)
  return { title: `${targetName} - Reseñas`, description: `Reseñas de ${targetName}` }
}

export default async function ProductoReviewsPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const { userId: clerkUserId } = await auth()
  const { targetName, sellerName } = await resolveTargetName('product', id)

  let tokenUserId: string | null = null
  if (!clerkUserId && sp?.token) {
    const verified = await verifyToken(
      process.env.BUYER_APP_URL!,
      sp.token as string,
      id
    )
    if (verified) tokenUserId = verified.userId
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-4">
          {!tokenUserId && (
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
            href={`https://zapasya.vercel.app/products/${id}`}
            aria-label="Ir a la app de compradores"
            className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-1.5 border border-gray-300 shadow-sm sm:shadow-none dark:border-gray-600 rounded-full sm:rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="sm:hidden text-xs">Comprar</span><span className="hidden sm:inline">Ir a la app de compradores</span>
          </ThemeLink>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
          {targetName}
        </h1>
        {sellerName && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Vendido por {sellerName}
          </p>
        )}
        {!sellerName && <div className="mb-8" />}
        <TargetReviews targetId={id} tipo="product" targetName={targetName} tokenUserId={tokenUserId} token={sp?.token ? (sp.token as string) : undefined} />
      </div>
    </main>
  )
}
