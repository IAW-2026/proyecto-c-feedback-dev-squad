import { getHomeStats } from '../services/db'

export default async function StatsSection() {
  const stats = await getHomeStats()

  return (
    <>
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 md:mb-12">
            En números
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stats.totalReviews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Reseñas publicadas</p>
            </div>
            {stats.topProduct && (
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-4xl font-bold text-amber-600 dark:text-yellow-400 mb-1">
                  {stats.topProduct.averageRating.toFixed(1)} ★
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full px-2"
                  title={stats.topProduct.nombre}
                >
                  {stats.topProduct.nombre}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Zapatilla mejor calificada</p>
              </div>
            )}
            {stats.topSeller && (
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-4xl font-bold text-emerald-600 dark:text-green-400 mb-1">
                  {stats.topSeller.averageRating.toFixed(1)} ★
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full px-2"
                  title={stats.topSeller.nombre}
                >
                  {stats.topSeller.nombre}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Vendedor mejor calificado</p>
              </div>
            )}
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                +{stats.reviewsThisYear}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Reseñas este año</p>
            </div>
          </div>
        </div>
      </section>

      {(stats.topReviewed || stats.latestReview) && (
        <section className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 md:mb-12">
              Lo mejor de{' '}
              <span className="text-gray-900 dark:text-white">Zapas</span>
              <span className="text-blue-600 dark:text-blue-400">YA</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {stats.topReviewed && (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Más reseñado</h3>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {stats.topReviewed.nombre}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.topReviewed.totalReviews} reseña{stats.topReviewed.totalReviews !== 1 ? 's' : ''} · {stats.topReviewed.averageRating.toFixed(1)} ★ promedio
                  </p>
                </div>
              )}
              {stats.latestReview && (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recién agregado</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{stats.latestReview.userName}</span>{' '}
                    calificó{' '}
                    <span className="font-medium text-gray-900 dark:text-white">{stats.latestReview.targetName}</span>
                  </p>
                  <p className="text-sm text-yellow-500 mb-2">
                    {'★'.repeat(stats.latestReview.rating)}{'☆'.repeat(5 - stats.latestReview.rating)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2">
                    {stats.latestReview.comentario}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
