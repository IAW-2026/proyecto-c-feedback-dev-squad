'use client'

import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import ReviewForm from '../../../components/ReviewForm'
import ReviewCard from '../../../components/ReviewCard'
import { createReview, getMyReviews, getUserPurchasableTargets } from '../../actions'
import type { CreateReviewInput, Review } from '../../../types'

interface Props {
  tokenUserId?: string | null
  token?: string | null
}

export default function CrearResenaClient({ tokenUserId, token }: Props) {
  const { userId: clerkUserId } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const effectiveUserId = clerkUserId || tokenUserId

  const rawTipo = searchParams.get('tipo')
  const tipoParam = (rawTipo === 'product' || rawTipo === 'seller') ? rawTipo : null
  const targetIdParam = searchParams.get('id') || ''
  const hasPreselectedTarget = !!(tipoParam && targetIdParam)

  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    const qs = params.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  const [loading, setLoading] = useState(false)
  const [createdReview, setCreatedReview] = useState<Review & { moderationSkipped?: boolean } | null>(null)
  const [error, setError] = useState('')
  const [reviewedIds, setReviewedIds] = useState<string[]>([])
  const [products, setProducts] = useState<{ id: string; name: string; sellerName: string }[]>([])
  const [sellers, setSellers] = useState<{ id: string; name: string }[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!effectiveUserId) return
    let ignore = false
    setDataLoading(true)

    const load = async () => {
      const [targetsRes, reviewsRes] = await Promise.all([
        getUserPurchasableTargets(tokenUserId).catch(() => ({ products: [], sellers: [] })),
        getMyReviews(effectiveUserId, { page: 1, limit: 100 }).catch(() => ({ data: [] })),
      ])
      if (ignore) return
      setReviewedIds(
        (reviewsRes.data ?? [])
          .filter(r => r.estado === 'published' || r.estado === 'reported')
          .map(r => `${r.tipo}:${r.targetId}`)
      )
      setProducts(targetsRes.products)
      setSellers(targetsRes.sellers)
      setDataLoading(false)
    }

    load()
    return () => { ignore = true }
  }, [effectiveUserId, tokenUserId, hasPreselectedTarget])

  const handleSubmit = async (input: CreateReviewInput) => {
    if (!effectiveUserId) return
    setLoading(true)
    setError('')

    try {
      const created = await createReview(
        input,
        user?.fullName ?? 'Usuario',
        token ? { value: token, tipo: input.tipo } : undefined
      )
      setCreatedReview(created)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error al publicar la reseña.')
    } finally {
      setLoading(false)
    }
  }

  if (createdReview) {
    return (
      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 text-center" role="status">
            <p className="text-green-700 dark:text-green-300 font-medium">
              Reseña publicada correctamente
            </p>
          </div>
          {createdReview.moderationSkipped && (
            <div className="bg-amber-100 dark:bg-yellow-900/30 border border-amber-200 dark:border-yellow-800 rounded-xl p-4 mb-6 text-center" role="alert">
              <p className="text-amber-700 dark:text-yellow-300 text-sm">
                La reseña se publicó, pero la moderación por IA no estuvo disponible.
              </p>
            </div>
          )}
          <ReviewCard review={createdReview} />
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setCreatedReview(null)}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Crear otra reseña
            </button>
            <Link
              href="/dashboard/mis-resenas"
              className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-center block"
            >
              Ver mis reseñas
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Crear Reseña
        </h1>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 px-4 py-2 rounded-lg mb-4 text-center" role="alert">
            {error}
          </p>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <ReviewForm
            onSubmit={handleSubmit}
            loading={loading}
            excludeIds={reviewedIds}
            products={products}
            sellers={sellers}
            dataLoading={dataLoading}
            tipo={tipoParam}
            targetId={targetIdParam}
            onTipoChange={(t) => updateURL({ tipo: t ?? undefined, id: undefined })}
            onTargetChange={(id) => updateURL({ id })}
          />
        </div>
      </div>
    </main>
  )
}
