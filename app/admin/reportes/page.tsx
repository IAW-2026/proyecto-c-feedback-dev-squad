'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { getReports, resolveReport } from '../../actions'
import ReportCard from '../../../components/ReportCard'
import SearchBar from '../../../components/SearchBar'
import Pagination from '../../../components/Pagination'
import type { Report, PaginatedResponse } from '../../../types'

type ResolvedFilter = 'all' | 'pending' | 'resolved'

export default function ReportesPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-gray-500 dark:text-gray-400">Cargando...</div>}>
      <ReportesContent />
    </Suspense>
  )
}

function ReportesContent() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search') || ''
  const resolvedFilter = (searchParams.get('estado') as ResolvedFilter) || 'pending'

  const [data, setData] = useState<PaginatedResponse<Report>>({ data: [], total: 0, page: 1, limit: 5, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState<string | null>(null)
  const [error, setError] = useState('')

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getReports({ page, limit: 5, search })
      let filtered = result.data
      if (resolvedFilter === 'pending') {
        filtered = filtered.filter(r => !r.resuelto)
      } else if (resolvedFilter === 'resolved') {
        filtered = filtered.filter(r => r.resuelto)
      }
      setData({
        ...result,
        data: filtered,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / 5),
      })
    } catch {
      setError('Error al cargar los reportes.')
    } finally {
      setLoading(false)
    }
  }, [page, search, resolvedFilter])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleResolve = async (reportId: string, action: 'dismiss' | 'remove', comment?: string) => {
    if (!user) return
    setResolving(reportId)
    try {
      await resolveReport(reportId, {
        adminName: user.fullName ?? 'Admin',
        adminComment: comment,
        action,
      })
      await fetchReports()
    } catch {
      setError('Error al resolver el reporte.')
    } finally {
      setResolving(null)
    }
  }

  const filterButtons: { label: string; value: ResolvedFilter }[] = [
    { label: 'Pendientes', value: 'pending' },
    { label: 'Resueltos', value: 'resolved' },
    { label: 'Todos', value: 'all' },
  ]

  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Reportes de Reseñas
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={q => updateParams({ search: q || undefined, page: '1' })}
              placeholder="Buscar en reportes..."
            />
          </div>
          <div className="flex gap-2">
            {filterButtons.map(btn => (
              <button
                key={btn.value}
                onClick={() => updateParams({ estado: btn.value === 'all' ? undefined : btn.value, page: '1' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  resolvedFilter === btn.value
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

        {loading ? (
          <div className="grid gap-4" aria-busy="true">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {resolvedFilter === 'pending'
                ? 'No hay reportes pendientes'
                : resolvedFilter === 'resolved'
                  ? 'No hay reportes resueltos'
                  : 'No hay reportes'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {data.data.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onResolve={handleResolve}
                  resolving={resolving === report.id}
                />
              ))}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={p => updateParams({ page: String(p) })} />
          </>
        )}
      </div>
    </main>
  )
}
