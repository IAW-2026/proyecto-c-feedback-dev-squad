import { Suspense } from 'react'
import ExplorarClient from './ExplorarClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explorar Reseñas',
  description: 'Buscá productos o vendedores para ver sus reseñas',
}

function LoadingSkeleton() {
  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Explorar Reseñas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Buscá un producto o vendedor para ver sus reseñas
        </p>
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ExplorarClient />
    </Suspense>
  )
}
