'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import ReviewForm from '../../../components/ReviewForm'
import ReviewCard from '../../../components/ReviewCard'
import { createReview } from '../../../services/mockData'
import type { CreateReviewInput, Review } from '../../../types'

export default function CrearResenaPage() {
  const { userId } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [createdReview, setCreatedReview] = useState<Review | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (input: CreateReviewInput) => {
    if (!userId) return
    setLoading(true)
    setError('')

    try {
      const review = await createReview(input, userId, 'Usuario')
      setCreatedReview(review)
    } catch {
      setError('Ocurrió un error al publicar la reseña.')
    } finally {
      setLoading(false)
    }
  }

  if (createdReview) {
    return (
      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-700 dark:text-green-300 font-medium">
              Reseña publicada correctamente
            </p>
          </div>
          <ReviewCard review={createdReview} />
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setCreatedReview(null)}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Crear otra reseña
            </button>
            <button
              onClick={() => router.push('/dashboard/mis-resenas')}
              className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Ver mis reseñas
            </button>
          </div>
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
          <ReviewForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </main>
  )
}
