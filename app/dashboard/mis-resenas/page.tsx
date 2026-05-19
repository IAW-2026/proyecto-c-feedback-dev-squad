'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { getMyReviews, updateReview, deleteReview } from '../../actions'
import ReviewCard from '../../../components/ReviewCard'
import SearchBar from '../../../components/SearchBar'
import Pagination from '../../../components/Pagination'
import type { ReviewType, PaginatedResponse, Review, UpdateReviewInput } from '../../../types'

export default function MisResenasPage() {
  const { userId } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [data, setData] = useState<PaginatedResponse<Review>>({ data: [], total: 0, page: 1, limit: 6, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [moderationWarning, setModerationWarning] = useState('')

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState<ReviewType | 'all'>('all')

  useEffect(() => {
    const syncFromUrl = () => {
      const sp = new URLSearchParams(window.location.search)
      const p = Math.max(1, Number(sp.get('page')) || 1)
      const s = sp.get('search') || ''
      const t = (sp.get('tipo') as ReviewType | 'all') || 'all'
      setPage(p)
      setSearch(s)
      setTipoFilter(t)
      const params = new URLSearchParams()
      params.set('page', String(p))
      if (s) params.set('search', s)
      if (t !== 'all') params.set('tipo', t)
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
    }
    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [router, pathname])

  useEffect(() => {
    if (!userId) return
    const fetchReviews = async () => {
      setLoading(true)
      setError('')
      try {
        const result = await getMyReviews(userId, {
          page,
          limit: 6,
          search,
          tipo: tipoFilter === 'all' ? undefined : tipoFilter,
        })
        if (page > result.totalPages) {
          updateParams({ page: '1' })
          return
        }
        setData(result)
      } catch {
        setError('Error al cargar las reseñas.')
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [userId, page, search, tipoFilter])

  const syncUrl = (p: number, s: string, t: ReviewType | 'all') => {
    const params = new URLSearchParams()
    params.set('page', String(p))
    if (s) params.set('search', s)
    if (t !== 'all') params.set('tipo', t)
    const qs = params.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newPage = 'page' in updates ? Number(updates.page) || 1 : page
    const newSearch = 'search' in updates ? (updates.search ?? '') : search
    const newFilter = 'tipo' in updates ? ((updates.tipo as ReviewType | 'all') || 'all') : tipoFilter
    setPage(newPage)
    setSearch(newSearch)
    setTipoFilter(newFilter)
    syncUrl(newPage, newSearch, newFilter)
  }

  const handleEdit = async (id: string, input: UpdateReviewInput) => {
    if (!userId) return
    setModerationWarning('')
    try {
      const { moderationSkipped } = await updateReview(id, input)
      if (moderationSkipped) {
        setModerationWarning('La reseña se editó, pero la moderación por IA no estuvo disponible.')
      }
    } catch (e) {
      if (e instanceof Error && e.message.startsWith('No aprobada:')) {
        throw e
      }
    }
    const result = await getMyReviews(userId, {
      page,
      limit: 6,
      search,
      tipo: tipoFilter === 'all' ? undefined : tipoFilter,
    })
    setData(result)
  }

  const handleDelete = async (id: string) => {
    if (!userId) return
    await deleteReview(id)
    const result = await getMyReviews(userId, {
      page,
      limit: 6,
      search,
      tipo: tipoFilter === 'all' ? undefined : tipoFilter,
    })
    setData(result)
  }

  const filterButtons: { label: string; value: ReviewType | 'all' }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Productos', value: 'product' },
    { label: 'Vendedores', value: 'seller' },
  ]

  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Mis Reseñas
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={q => updateParams({ search: q || undefined, page: '1' })}
              placeholder="Buscar en mis reseñas..."
              defaultValue={search}
            />
          </div>
          <div className="flex gap-2">
            {filterButtons.map(btn => (
              <button
                key={btn.value}
                onClick={() => updateParams({ tipo: btn.value === 'all' ? undefined : btn.value, page: '1' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tipoFilter === btn.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 px-4 py-2 rounded-lg mb-4" role="alert">
            {error}
          </p>
        )}

        {moderationWarning && (
          <div className="text-sm text-amber-700 dark:text-yellow-300 bg-amber-100 dark:bg-yellow-900/50 px-4 py-2 rounded-lg mb-4" role="alert">
            {moderationWarning}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4" aria-busy="true">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Todavía no publicaste reseñas
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {data.data.map(review => (
                <ReviewCard key={review.id} review={review} editable onUpdate={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
            <Pagination page={page} totalPages={data.totalPages} onPageChange={p => updateParams({ page: String(p) })} />
          </>
        )}
      </div>
    </main>
  )
}
