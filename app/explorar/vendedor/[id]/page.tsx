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
      await verifyToken(process.env.BUYER_APP_URL!, sp.token as string, id)
      ?? await verifyToken(process.env.API_KEY_SELLER_APP!, sp.token as string, id)
    )?.userId ?? null
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
            href="https://proyecto-c-seller-dev-squad.vercel.app/dashboard/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Ir a la app de vendedores &rarr;
          </a>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {targetName}
        </h1>
        <TargetReviews targetId={id} tipo="seller" targetName={targetName} tokenUserId={tokenUserId} token={sp?.token ? (sp.token as string) : undefined} />
      </div>
    </main>
  )
}
