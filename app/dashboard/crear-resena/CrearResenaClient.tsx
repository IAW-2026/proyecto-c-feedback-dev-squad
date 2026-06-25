'use client'

import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import ReviewForm from '../../../components/ReviewForm'
import ReviewCard from '../../../components/ReviewCard'
import ThemeLink from '../../../components/ThemeLink'
import { createReview, getMyReviewedTargetIds, getUserPurchasableTargets } from '../../actions'
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
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const [products, setProducts] = useState<{ id: string; name: string; sellerName: string }[]>([])
  const [sellers, setSellers] = useState<{ id: string; name: string }[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!effectiveUserId) return
    let ignore = false
    setDataLoading(true)

    const load = async () => {
      const [targetsRes, ids] = await Promise.all([
        getUserPurchasableTargets(tokenUserId).catch(() => ({ products: [], sellers: [] })),
        getMyReviewedTargetIds(tokenUserId).catch(() => [] as string[]),
      ])
      if (ignore) return
      setReviewedIds(ids)
      setProducts(targetsRes.products)
      setSellers(targetsRes.sellers)

      if (hasPreselectedTarget && ids.includes(`${tipoParam}:${targetIdParam}`)) {
        setAlreadyReviewed(true)
      }

      setDataLoading(false)
    }

    load()
    return () => { ignore = true }
  }, [effectiveUserId, tokenUserId, hasPreselectedTarget, tipoParam, targetIdParam])

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
          <ThemeLink
            href="https://zapasya.vercel.app/pedidos"
            className="w-full mt-6 inline-flex items-center justify-center gap-2 px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Ir a mis pedidos
          </ThemeLink>
        </div>
      </main>
    )
  }

  if (alreadyReviewed && hasPreselectedTarget) {
    return (
      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-center" role="status">
            <p className="text-amber-700 dark:text-amber-300 font-medium">
              Ya habías reseñado este {tipoParam === 'product' ? 'producto' : 'vendedor'}
            </p>
          </div>
          <ThemeLink
            href="https://zapasya.vercel.app/pedidos"
            className="w-full mt-6 inline-flex items-center justify-center gap-2 px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Ir a mis pedidos
          </ThemeLink>
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
