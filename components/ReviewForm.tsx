'use client'

import { useState } from 'react'
import type { ReviewType, CreateReviewInput } from '../types'
import StarRating from './StarRating'
import CustomSelect from './CustomSelect'

interface Props {
  onSubmit: (input: CreateReviewInput) => Promise<void>
  loading?: boolean
  excludeIds?: string[]
  purchasableProductIds?: string[]
  purchasableSellerIds?: string[]
  tipo?: ReviewType | null
  targetId?: string
  onTipoChange?: (tipo: ReviewType | null) => void
  onTargetChange?: (targetId: string) => void
}

export default function ReviewForm({ onSubmit, loading, excludeIds, purchasableProductIds, purchasableSellerIds, tipo: initialTipo, targetId: initialTargetId, onTipoChange, onTargetChange }: Props) {
  const [tipo, setTipo] = useState<ReviewType | null>(initialTipo ?? null)
  const [targetId, setTargetId] = useState(initialTargetId ?? '')
  const [rating, setRating] = useState(0)
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')

  const mockProducts = [
    { id: 'p1', name: 'Nike Air Max 270', sellerName: 'Sneakers Store' },
    { id: 'p2', name: 'Adidas Ultraboost 22', sellerName: 'Zapatería Deportiva SRL' },
    { id: 'p3', name: 'Puma RS-X', sellerName: 'Urban Kicks' },
    { id: 'p4', name: 'Converse Chuck Taylor', sellerName: 'Sneakers Store' },
    { id: 'p5', name: 'Vans Old Skool', sellerName: 'Zapatería Deportiva SRL' },
    { id: 'p6', name: 'New Balance 574', sellerName: 'Sneakers Store' },
    { id: 'p7', name: 'Reebok Classic Leather', sellerName: 'Zapatería Deportiva SRL' },
    { id: 'p8', name: 'Skechers Go Walk', sellerName: 'Urban Kicks' },
    { id: 'p9', name: 'Under Armour HOVR', sellerName: 'Sneakers Store' },
    { id: 'p10', name: 'Fila Disruptor', sellerName: 'Fashion Shoes' },
  ]

  const mockSellers = [
    { id: 's1', name: 'Zapatería Deportiva SRL' },
    { id: 's2', name: 'Sneakers Store' },
    { id: 's3', name: 'Urban Kicks' },
    { id: 's4', name: 'Fashion Shoes' },
  ]

  const availableProducts = mockProducts.filter(p =>
    !excludeIds?.includes(`product:${p.id}`)
    && (purchasableProductIds === undefined || purchasableProductIds.includes(p.id))
  )
  const availableSellers = mockSellers.filter(s =>
    !excludeIds?.includes(`seller:${s.id}`)
    && (purchasableSellerIds === undefined || purchasableSellerIds.includes(s.id))
  )

  const handleTipoChange = (newTipo: ReviewType | null) => {
    setTipo(newTipo)
    if (newTipo === null) {
      setTargetId('')
    }
    onTipoChange?.(newTipo)
  }

  const handleTargetChange = (newTargetId: string) => {
    setTargetId(newTargetId)
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
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Reseñar Producto
          </button>
          <button
            onClick={() => handleTipoChange('seller')}
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-lg"
          >
            Reseñar Vendedor
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <button
        type="button"
        onClick={reset}
        className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
      >
        &larr; Cambiar tipo de reseña
      </button>

      {(tipo === 'product' ? availableProducts : availableSellers).length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Ya reseñaste todos los {tipo === 'product' ? 'productos' : 'vendedores'} disponibles.
        </div>
      ) : (
        <CustomSelect
          label={tipo === 'product' ? 'Producto' : 'Vendedor'}
          options={tipo === 'product' ? availableProducts : availableSellers}
          value={targetId}
          onChange={handleTargetChange}
          placeholder={tipo === 'product' ? 'Seleccionar producto...' : 'Seleccionar vendedor...'}
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
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Publicando...' : 'Publicar Reseña'}
      </button>
    </form>
  )
}
