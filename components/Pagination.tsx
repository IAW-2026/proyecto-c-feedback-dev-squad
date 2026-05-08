'use client'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []
    const delta = 2
    const left = Math.max(2, page - delta)
    const right = Math.min(totalPages - 1, page + delta)

    pages.push(1)
    if (left > 2) pages.push('ellipsis')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 1) pages.push('ellipsis')
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-3 sm:px-3 sm:py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[44px]"
        aria-label="Página anterior"
      >
        &laquo; Anterior
      </button>

      {getVisiblePages().map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e${i}`} className="px-2 py-2 text-gray-400 dark:text-gray-500">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[44px] px-3 py-3 sm:py-2 text-sm rounded-lg border transition-colors font-medium ${
              p === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={`Página ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-3 sm:px-3 sm:py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[44px]"
        aria-label="Página siguiente"
      >
        Siguiente &raquo;
      </button>
    </nav>
  )
}
