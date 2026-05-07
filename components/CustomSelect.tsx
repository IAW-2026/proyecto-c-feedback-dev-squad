'use client'

import { useState, useRef, useEffect } from 'react'

interface Option {
  id: string
  name: string
}

interface Props {
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export default function CustomSelect({ label, options, value, onChange, placeholder }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && value && listRef.current) {
      const selected = listRef.current.querySelector(`[data-value="${value}"]`)
      selected?.scrollIntoView({ block: 'nearest' })
    }
  }, [isOpen, value])

  const selectedOption = options.find(o => o.id === value)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors cursor-pointer text-left ${
            value
              ? 'text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
              : 'text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600'
          }`}
        >
          <span>{value ? selectedOption?.name : placeholder}</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-y-auto max-h-60"
          >
            {options.map(opt => (
              <li key={opt.id}>
                <button
                  type="button"
                  data-value={opt.id}
                  onClick={() => { onChange(opt.id); setIsOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 transition-colors cursor-pointer ${
                    opt.id === value
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
