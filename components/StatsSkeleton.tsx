export default function StatsSkeleton() {
  return (
    <>
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-56 mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
