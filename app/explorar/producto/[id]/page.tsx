import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { resolveTargetName } from '../../../../services/db'
import TargetReviews from '../../../../components/TargetReviews'
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
      process.env.API_KEY_BUYER_APP!,
      sp.token as string,
      id
    )
    if (verified) tokenUserId = verified.userId
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/explorar"
            className="inline-block text-sm text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            &larr; Volver a explorar
          </Link>
          <a
            href="https://zapasya.vercel.app/home"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Ir a la app de compradores &rarr;
          </a>
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
