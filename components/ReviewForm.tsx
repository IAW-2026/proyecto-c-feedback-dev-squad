'use client'

import { useState } from 'react'
import type { ReviewType, CreateReviewInput } from '../types'
import StarRating from './StarRating'
import CustomSelect from './CustomSelect'

interface Props {
  onSubmit: (input: CreateReviewInput) => Promise<void>
  loading?: boolean
}

export default function ReviewForm({ onSubmit, loading }: Props) {
  const [tipo, setTipo] = useState<ReviewType | null>(null)
  const [targetId, setTargetId] = useState('')
  const [rating, setRating] = useState(0)
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')

  const mockProducts = [
    { id: 'p1', name: 'Nike Air Max 270' },
    { id: 'p2', name: 'Adidas Ultraboost 22' },
    { id: 'p3', name: 'Puma RS-X' },
    { id: 'p4', name: 'Converse Chuck Taylor' },
    { id: 'p5', name: 'Vans Old Skool' },
  ]

  const mockSellers = [
    { id: 's1', name: 'Zapatería Deportiva SRL' },
    { id: 's2', name: 'Sneakers Store' },
    { id: 's3', name: 'Urban Kicks' },
  ]

  const reset = () => {
    setTipo(null)
    setTargetId('')
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

    await onSubmit({ tipo, targetId: targetId.trim(), rating, comentario: comentario.trim() })
  }

  if (!tipo) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ¿Qué deseas reseñar?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setTipo('product')}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Reseñar Producto
          </button>
          <button
            onClick={() => setTipo('seller')}
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
        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        &larr; Cambiar tipo de reseña
      </button>

      <CustomSelect
        label={tipo === 'product' ? 'Producto' : 'Vendedor'}
        options={tipo === 'product' ? mockProducts : mockSellers}
        value={targetId}
        onChange={setTargetId}
        placeholder={tipo === 'product' ? 'Seleccionar producto...' : 'Seleccionar vendedor...'}
      />

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
          maxLength={100}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          {comentario.length}/100 caracteres (mín. 10)
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
