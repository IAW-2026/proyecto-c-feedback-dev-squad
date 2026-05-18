'use client'

import { useState } from 'react'
import type { Review, UpdateReviewInput } from '../types'
import StarRating from './StarRating'
import ConfirmModal from './ConfirmModal'

interface Props {
  review: Review
  editable?: boolean
  reportable?: boolean
  onUpdate?: (id: string, data: UpdateReviewInput) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onReport?: (id: string) => void
}

export default function ReviewCard({ review, editable, reportable, onUpdate, onDelete, onReport }: Props) {
  const [editing, setEditing] = useState(false)
  const [editRating, setEditRating] = useState(review.rating)
  const [editComentario, setEditComentario] = useState(review.comentario)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const estadoColors: Record<string, string> = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    reported: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    removed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  }
  const estadoLabels: Record<string, string> = {
    published: 'Publicada',
    reported: 'Reportada',
    removed: 'Eliminada',
  }

  const handleSave = async () => {
    if (!onUpdate) return
    setSaving(true)
    setEditError('')
    try {
      await onUpdate(review.id, { rating: editRating, comentario: editComentario.trim() })
      setEditing(false)
    } catch {
      setEditError('Error al guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditRating(review.rating)
    setEditComentario(review.comentario)
    setEditError('')
    setEditing(false)
  }

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-300 dark:border-gray-700 p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {review.userName ?? 'Usuario'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(review.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-start gap-2 flex-wrap">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${estadoColors[review.estado]}`}>
            {estadoLabels[review.estado]}
          </span>
          {editable && review.estado === 'published' && !editing && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-xs font-medium px-3 py-1.5 sm:py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs font-medium px-3 py-1.5 sm:py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Eliminar
              </button>
            </>
          )}
          {reportable && review.estado === 'published' && (
            <button
              onClick={() => onReport?.(review.id)}
              aria-label={`Reportar reseña de ${review.userName ?? 'Usuario'}`}
              className="text-xs font-medium px-3 py-1.5 sm:py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
            >
              Reportar
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calificación
            </label>
            <div className="flex items-center gap-2">
              <StarRating rating={editRating} onChange={setEditRating} size="md" />
          <span className="text-sm text-gray-500 dark:text-gray-500">
            ({editRating}/5)
          </span>
            </div>
          </div>

          <div>
            <label htmlFor={`edit-comentario-${review.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comentario
            </label>
            <textarea
              id={`edit-comentario-${review.id}`}
              rows={3}
              value={editComentario}
              onChange={e => setEditComentario(e.target.value)}
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{editComentario.length}/200 caracteres</p>
          </div>

          {editError && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 px-4 py-2 rounded-lg" role="alert">
              {editError}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !editComentario.trim() || editComentario.trim().length < 10}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors font-medium text-sm"
            >
              Cancelar
            </button>
          </div>

          <div>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {review.targetName ?? (review.tipo === 'product' ? 'Producto' : 'Vendedor')}
            </span>
            {review.tipo === 'product' && review.sellerName && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Vendido por {review.sellerName}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm text-gray-500 dark:text-gray-500">
              ({review.rating}/5)
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {review.comentario}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {review.targetName ?? (review.tipo === 'product' ? 'Producto' : 'Vendedor')}
              </span>
              {review.tipo === 'product' && review.sellerName && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Vendido por {review.sellerName}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        open={confirmDelete}
        title="Eliminar reseña"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        danger
        onConfirm={async () => {
          setConfirmDelete(false)
          await onDelete?.(review.id)
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </article>
  )
}
