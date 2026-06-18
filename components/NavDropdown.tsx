'use client'

interface Props {
  icon: string
  label: string
  isOpen: boolean
  onToggle: () => void
  active?: boolean
  children: React.ReactNode
}

const BASE_CLASSES =
  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 whitespace-nowrap'

const INACTIVE_CLASSES =
  'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'

const ACTIVE_CLASSES =
  'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'

export default function NavDropdown({ icon, label, isOpen, onToggle, active, children }: Props) {
  return (
    <>
      <button
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`${BASE_CLASSES} ${active ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        {label}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          {children}
        </div>
      )}
    </>
  )
}
