'use client'

import type { Review } from '../types'
import StarRating from './StarRating'

interface Props {
  review: Review
}

export default function ReviewCard({ review }: Props) {
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

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
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
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${estadoColors[review.estado]}`}>
          {estadoLabels[review.estado]}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <StarRating rating={review.rating} size="sm" />
        <span className="text-sm text-gray-400 dark:text-gray-500">
          ({review.rating}/5)
        </span>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
        {review.comentario}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          {review.targetName ?? (review.tipo === 'product' ? 'Producto' : 'Vendedor')}
        </span>
      </div>
    </article>
  )
}
