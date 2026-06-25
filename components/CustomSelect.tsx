'use client'

import { useState, useRef, useEffect, useId } from 'react'

interface Option {
  id: string
  name: string
  subtitle?: string
}

interface Props {
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  pageSize?: number
  searchable?: boolean
  searchPlaceholder?: string
  disabled?: boolean
}

export default function CustomSelect({ label, options, value, onChange, placeholder, pageSize = 4, searchable, searchPlaceholder = 'Buscar...', disabled }: Props) {
  const size = Math.max(1, pageSize)
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [highlighted, setHighlighted] = useState(-1)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const labelId = useId()

  const filteredOptions = searchQuery
    ? options.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  const totalPages = Math.max(1, Math.ceil(filteredOptions.length / size))
  const paginatedOptions = filteredOptions.slice((page - 1) * size, page * size)
  const selectedOption = options.find(o => o.id === value)

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
  }, [isOpen, value, page])

  useEffect(() => {
    if (isOpen && searchable) {
      inputRef.current?.focus()
    }
  }, [isOpen, searchable])

  useEffect(() => {
    if (!isOpen) {
      setHighlighted(-1)
      setPage(1)
      setSearchQuery('')
    }
  }, [isOpen])

  const handleKey = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) { setIsOpen(true); return }
        const nextIdx = highlighted + 1
        if (nextIdx >= filteredOptions.length) break
        setHighlighted(nextIdx)
        if (nextIdx >= page * size) setPage(p => p + 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) { setIsOpen(true); return }
        const prevIdx = highlighted - 1
        if (prevIdx < 0) break
        setHighlighted(prevIdx)
        if (prevIdx < (page - 1) * size) setPage(p => p - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (!isOpen) { setIsOpen(true); return }
        if (highlighted >= 0 && highlighted < filteredOptions.length) {
          onChange(filteredOptions[highlighted].id)
          setIsOpen(false)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        if (searchable) {
          inputRef.current?.blur()
        } else {
          triggerRef.current?.focus()
        }
        break
      case 'Home':
        e.preventDefault()
        setHighlighted(0)
        setPage(1)
        break
      case 'End':
        e.preventDefault()
        setHighlighted(filteredOptions.length - 1)
        setPage(totalPages)
        break
    }
  }

  if (disabled) {
    const selectedOption = options.find(o => o.id === value)
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
        <div className="w-full px-4 py-3 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white opacity-60 cursor-not-allowed text-left">
          {selectedOption?.name || placeholder}
        </div>
      </div>
    )
  }

  return (
    <div>
      <label id={labelId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative" ref={containerRef}>
        {searchable ? (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={isOpen ? searchQuery : (selectedOption?.name || '')}
              onChange={e => {
                setSearchQuery(e.target.value)
                if (!isOpen) setIsOpen(true)
                setPage(1)
                setHighlighted(-1)
              }}
              onFocus={() => {
                if (!isOpen) {
                  setIsOpen(true)
                  setSearchQuery('')
                }
              }}
              onKeyDown={handleKey}
              placeholder={value && !isOpen ? '' : placeholder}
              aria-labelledby={labelId}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className={`w-full px-4 py-3 sm:py-2.5 border rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-left ${
                value
                  ? 'text-gray-900 dark:text-white border-gray-400 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-500 border-gray-400 dark:border-gray-600'
              }`}
            />
            <svg
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKey}
            aria-labelledby={labelId}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={`w-full flex items-center justify-between px-4 py-3 sm:py-2.5 border rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors cursor-pointer text-left ${
              value
                ? 'text-gray-900 dark:text-white border-gray-400 dark:border-gray-600'
                : 'text-gray-500 dark:text-gray-500 border-gray-400 dark:border-gray-600'
            }`}
          >
            <span>{value ? selectedOption?.name : placeholder}</span>
            <svg
              className="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
            {filteredOptions.length === 0 ? (
              <p className="px-4 py-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                {searchQuery ? 'Sin resultados' : 'Sin opciones disponibles'}
              </p>
            ) : (
              <ul
                ref={listRef}
                role="listbox"
                aria-labelledby={labelId}
                className="overflow-y-auto max-h-60"
              >
                {paginatedOptions.map((opt, idx) => {
                  const realIdx = (page - 1) * size + idx
                  return (
                    <li
                      key={opt.id}
                      role="option"
                      aria-selected={opt.id === value}
                      data-value={opt.id}
                    >
                      <button
                        type="button"
                        onClick={() => { onChange(opt.id); setIsOpen(false) }}
                        onMouseEnter={() => setHighlighted(realIdx)}
                        className={`w-full text-left px-4 py-3 sm:py-2.5 transition-colors cursor-pointer overflow-hidden ${
                          realIdx === highlighted
                            ? 'bg-blue-100 dark:bg-blue-800/40'
                            : opt.id === value
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="block truncate">
                          <span>{opt.name}</span>
                          {opt.subtitle && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">· {opt.subtitle}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  )
                })}
                {totalPages > 1 && (
                  <li className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-600">
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{page}/{totalPages}</span>
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
