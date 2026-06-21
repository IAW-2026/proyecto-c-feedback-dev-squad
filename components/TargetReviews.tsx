'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import type { Review, ReviewStats, PaginatedResponse } from '../types'
import { getTargetReviewsAction, getTargetStatsAction, getTargetAISummaryAction, reportReviewAction } from '../app/actions'
import ReviewCard from './ReviewCard'
import StarRating from './StarRating'
import Pagination from './Pagination'
import ReportModal from './ReportModal'

interface Props {
  targetId: string
  tipo: 'product' | 'seller'
  targetName: string
}

export default function TargetReviews({ targetId, tipo, targetName }: Props) {
  const { userId } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [reviews, setReviews] = useState<PaginatedResponse<Review>>({ data: [], total: 0, page: 1, limit: 5, totalPages: 0 })
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [aiSummary, setAiSummary] = useState('')
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false)
  const [aiSummaryError, setAiSummaryError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [page, setPage] = useState(1)
  const [reportReviewId, setReportReviewId] = useState<string | null>(null)

  useEffect(() => {
    const syncFromUrl = () => {
      const sp = new URLSearchParams(window.location.search)
      const p = Math.max(1, Number(sp.get('page')) || 1)
      setPage(p)
      const params = new URLSearchParams()
      const token = sp.get('token')
      if (token) params.set('token', token)
      params.set('page', String(p))
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [router, pathname])

  const fetchReviewsAndStats = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [reviewsData, statsData] = await Promise.all([
        getTargetReviewsAction(targetId, tipo, { page, limit: 5 }),
        getTargetStatsAction(targetId, tipo),
      ])
      if (page > reviewsData.totalPages) {
        const params = new URLSearchParams()
        const token = new URLSearchParams(window.location.search).get('token')
        if (token) params.set('token', token)
        params.set('page', '1')
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        setPage(1)
        return
      }
      setReviews(reviewsData)
      setStats(statsData)
    } catch {
      setError('Error al cargar las reseñas.')
    } finally {
      setLoading(false)
    }
  }, [targetId, tipo, page, router, pathname])

  useEffect(() => {
    fetchReviewsAndStats()
  }, [fetchReviewsAndStats])

  const openReport = (reviewId: string) => {
    setReportReviewId(reviewId)
  }

  const handleReportSubmit = async (razon: string) => {
    if (!reportReviewId) return
    await reportReviewAction(reportReviewId, razon)
    setReportReviewId(null)
    fetchReviewsAndStats()
  }

  const handleAiSummary = async () => {
    if (aiSummaryLoading || aiSummary) return
    setAiSummaryLoading(true)
    setAiSummaryError('')
    try {
      const summary = await getTargetAISummaryAction(targetId, tipo)
      setAiSummary(summary)
    } catch (e) {
      setAiSummaryError(e instanceof Error ? e.message : 'La IA no pudo generar un resumen.')
    } finally {
      setAiSummaryLoading(false)
    }
  }

  const distributionMax = stats ? Math.max(...Object.values(stats.ratingDistribution), 1) : 1

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 px-4 py-2 rounded-lg" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-300 dark:border-gray-700 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-300 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {stats && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-300 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</p>
                  <div className="flex items-center justify-center mt-1">
                    <StarRating rating={Math.round(stats.averageRating)} size="sm" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stats.totalReviews} reseña{stats.totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = stats.ratingDistribution[star] ?? 0
                  const pct = (count / distributionMax) * 100
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-right text-gray-600 dark:text-gray-400">{star}★</span>
                      <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-gray-500 dark:text-gray-400 text-xs">{count}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0" aria-hidden="true">🤖</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Resumen general de reseñas</h2>

                {!aiSummaryLoading && !aiSummary && !aiSummaryError && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generá un resumen automático de las reseñas
                    </p>
                    <button
                      onClick={handleAiSummary}
                      className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generar con IA
                    </button>
                  </div>
                )}

                {aiSummaryLoading && (
                  <div className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Analizando reseñas con IA...</span>
                  </div>
                )}

                {aiSummaryError && (
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-red-600 dark:text-red-400 truncate">{aiSummaryError}</p>
                    <button
                      onClick={handleAiSummary}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reintentar
                    </button>
                  </div>
                )}

                {aiSummary && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{aiSummary}</p>
                )}
              </div>
            </div>
          </section>

          {reviews.data.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <p className="text-lg text-gray-500 dark:text-gray-400">No hay reseñas publicadas todavía</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {reviews.data.map(review => (
                  <ReviewCard key={review.id} review={review} reportable={!!userId && review.userId !== userId} onReport={openReport} />
                ))}
              </div>
              <Pagination page={page} totalPages={reviews.totalPages} onPageChange={p => {
                setPage(p)
                const params = new URLSearchParams()
                const token = new URLSearchParams(window.location.search).get('token')
                if (token) params.set('token', token)
                params.set('page', String(p))
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
              }} />
            </>
          )}
        </>
      )}

      <ReportModal
        open={reportReviewId !== null}
        onSubmit={handleReportSubmit}
        onClose={() => setReportReviewId(null)}
      />
    </div>
  )
}
