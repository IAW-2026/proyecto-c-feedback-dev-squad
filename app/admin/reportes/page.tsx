import { Suspense } from 'react'
import AdminReportsClient from './AdminReportsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reportes de Reseñas - Admin',
  description: 'Gestionar reportes de reseñas',
}

function LoadingSkeleton() {
  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Reportes de Reseñas
        </h1>
        <div className="grid gap-4">
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
      </div>
    </main>
  )
}

export default function ReportesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminReportsClient />
    </Suspense>
  )
}
