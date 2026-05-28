import { Suspense } from 'react'
import CrearResenaClient from './CrearResenaClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear Reseña',
  description: 'Publicá una reseña sobre un producto o vendedor',
}

function LoadingSkeleton() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Crear Reseña
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CrearResenaPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CrearResenaClient />
    </Suspense>
  )
}
