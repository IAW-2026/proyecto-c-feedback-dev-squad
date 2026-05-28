'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { searchTargets } from '../actions'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import type { PaginatedResponse } from '../../types'
import type { SearchResult } from '../actions'

type TabValue = 'all' | 'product' | 'seller'

export default function ExplorarClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page')) || 1))
  const [search, setSearch] = useState(() => searchParams.get('q') || '')
  const [tab, setTab] = useState<TabValue>(() => (searchParams.get('tab') as TabValue) || 'all')

  const [data, setData] = useState<PaginatedResponse<SearchResult>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const syncTimerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const syncFromUrl = () => {
      const sp = new URLSearchParams(window.location.search)
      setPage(Math.max(1, Number(sp.get('page')) || 1))
      setSearch(sp.get('q') || '')
      setTab((sp.get('tab') as TabValue) || 'all')
    }
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  const syncUrl = (p: number, q: string, t: TabValue) => {
    const params = new URLSearchParams()
    params.set('page', String(p))
    if (q) params.set('q', q)
    if (t !== 'all') params.set('tab', t)
    const qs = params.toString()
    clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(
      () => router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false }),
      50,
    )
  }

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const result = await searchTargets(search, tab === 'all' ? undefined : tab, page, 10)
        if (cancelled) return
        if (result.totalPages > 0 && page > result.totalPages && page > 1) {
          setPage(1)
          return
        }
        setData(result)
        setLoading(false)
      } catch {
        if (!cancelled) {
          setError('Error al cargar los resultados.')
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [page, search, tab])

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newPage = 'page' in updates ? Number(updates.page) || 1 : page
    const newSearch = 'search' in updates ? (updates.search ?? '') : search
    const newTab = 'tab' in updates ? ((updates.tab as TabValue) || 'all') : tab
    setPage(newPage)
    setSearch(newSearch)
    setTab(newTab)
    syncUrl(newPage, newSearch, newTab)
  }

  const tabs: { label: string; value: TabValue }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Productos', value: 'product' },
    { label: 'Vendedores', value: 'seller' },
  ]

  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Explorar Reseñas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Buscá un producto o vendedor para ver sus reseñas
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={q => updateParams({ search: q || undefined, page: '1' })}
              placeholder="Buscar productos o vendedores..."
              defaultValue={search}
            />
          </div>
          <div className="flex gap-2" role="tablist" aria-label="Filtrar por tipo">
            {tabs.map(t => (
              <button
                key={t.value}
                role="tab"
                aria-selected={tab === t.value}
                onClick={() => updateParams({ tab: t.value === 'all' ? undefined : t.value, page: '1' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {t.label}
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
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-8">
            No se encontraron resultados
          </p>
        ) : (
          <>
            <ul className="space-y-2">
              {data.data.map(item => (
                <li key={`${item._tipo}:${item.id}`}>
                  <Link
                    href={item._tipo === 'product' ? `/explorar/producto/${item.id}` : `/explorar/vendedor/${item.id}`}
                    className="block w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 p-4 shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{item.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item._tipo === 'product' ? 'Producto' : 'Vendedor'}
                      {item._tipo === 'product' && item.vendedorNombre && ` — Vendido por ${item.vendedorNombre}`}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination page={page} totalPages={data.totalPages} onPageChange={p => updateParams({ page: String(p) })} />
          </>
        )}
      </div>
    </main>
  )
}
