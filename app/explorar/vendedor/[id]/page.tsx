import Link from 'next/link'
import { resolveTargetName } from '../../../../services/db'
import TargetReviews from '../../../../components/TargetReviews'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { targetName } = await resolveTargetName('seller', id)
  return { title: `${targetName} - Reseñas`, description: `Reseñas de ${targetName}` }
}

export default async function VendedorReviewsPage({ params }: Props) {
  const { id } = await params
  const { targetName } = await resolveTargetName('seller', id)

  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/explorar"
          className="inline-block text-sm text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-4"
        >
          &larr; Volver a explorar
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {targetName}
        </h1>
        <TargetReviews targetId={id} tipo="seller" targetName={targetName} />
      </div>
    </main>
  )
}
