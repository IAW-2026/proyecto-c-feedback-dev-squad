'use client'

import { useState } from 'react'
import type { ReviewType, CreateReviewInput } from '../types'
import StarRating from './StarRating'
import CustomSelect from './CustomSelect'
import ThemeLink from './ThemeLink'

interface Props {
  onSubmit: (input: CreateReviewInput) => Promise<void>
  loading?: boolean
  excludeIds?: string[]
  products: { id: string; name: string; sellerName: string }[]
  sellers: { id: string; name: string }[]
  dataLoading?: boolean
  tipo?: ReviewType | null
  targetId?: string
  onTipoChange?: (tipo: ReviewType | null) => void
  onTargetChange?: (targetId: string) => void
}

export default function ReviewForm({ onSubmit, loading, excludeIds, products, sellers, dataLoading, tipo: initialTipo, targetId: initialTargetId, onTipoChange, onTargetChange }: Props) {
  const [tipo, setTipo] = useState<ReviewType | null>(initialTipo ?? null)
  const [targetId, setTargetId] = useState(initialTargetId ?? '')
  const [rating, setRating] = useState(0)
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')

  const availableProducts = products.filter(p =>
    !excludeIds?.includes(`product:${p.id}`)
  )
  const availableSellers = sellers.filter(s =>
    !excludeIds?.includes(`seller:${s.id}`)
  )

  const handleTipoChange = (newTipo: ReviewType | null) => {
    setTipo(newTipo)
    setRating(0)
    setComentario('')
    setError('')
    if (newTipo === null) {
      setTargetId('')
    }
    onTipoChange?.(newTipo)
  }

  const handleTargetChange = (newTargetId: string) => {
    setTargetId(newTargetId)
    setRating(0)
    setComentario('')
    setError('')
    onTargetChange?.(newTargetId)
  }

  const reset = () => {
    handleTipoChange(null)
    setRating(0)
    setComentario('')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!tipo) {
      setError('Seleccioná si querés reseñar un producto o un vendedor.')
      return
    }
    if (!targetId) {
      setError('Seleccioná un producto o vendedor.')
      return
    }
    if (rating === 0) {
      setError('Seleccioná una calificación.')
      return
    }
    if (!comentario.trim()) {
      setError('Escribí un comentario.')
      return
    }
    if (comentario.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres.')
      return
    }

    await onSubmit({
      tipo,
      targetId: targetId.trim(),
      rating,
      comentario: comentario.trim(),
    })
  }

  if (!tipo) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ¿Qué deseas reseñar?
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => handleTipoChange('product')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Reseñar Producto
          </button>
          <button
            onClick={() => handleTipoChange('seller')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-lg"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M9 22V12h6v10" />
            </svg>
            Reseñar Vendedor
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-row flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={reset}
          aria-label="Cambiar tipo de reseña"
          className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-1.5 border border-gray-300 shadow-sm sm:shadow-none dark:border-gray-600 rounded-full sm:rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          <span className="sm:hidden text-xs">Cambiar</span><span className="hidden sm:inline">Cambiar tipo de reseña</span>
        </button>
        <ThemeLink
          href="https://zapasya.vercel.app/pedidos"
          aria-label="Ir a mis pedidos"
          className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-1.5 border border-gray-300 shadow-sm sm:shadow-none dark:border-gray-600 rounded-full sm:rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span className="sm:hidden text-xs">Pedidos</span><span className="hidden sm:inline">Ir a mis pedidos</span>
        </ThemeLink>
      </div>

      {(tipo === 'product' ? availableProducts : availableSellers).length === 0 ? (
        dataLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tenés {tipo === 'product' ? 'productos' : 'vendedores'} para reseñar
          </div>
        )
      ) : (
        <CustomSelect
          label={tipo === 'product' ? 'Producto' : 'Vendedor'}
          options={tipo === 'product'
            ? availableProducts.map(p => ({ id: p.id, name: p.name, subtitle: `Vendido por ${p.sellerName}` }))
            : availableSellers}
          value={targetId}
          onChange={handleTargetChange}
          placeholder={tipo === 'product' ? 'Buscar producto...' : 'Buscar vendedor...'}
          searchable
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Calificación
        </label>
        <StarRating rating={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Comentario
        </label>
        <textarea
          id="comentario"
          rows={4}
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Contá tu experiencia..."
          maxLength={200}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {comentario.length}/200 caracteres (mín. 10)
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 px-4 py-2 rounded-lg" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
        {loading ? 'Publicando...' : 'Publicar Reseña'}
      </button>
    </form>
  )
}
