'use client'

import { useState, useRef, useEffect, useId } from 'react'

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
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const labelId = useId()

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

  useEffect(() => {
    if (!isOpen) setHighlighted(-1)
  }, [isOpen])

  const selectedOption = options.find(o => o.id === value)

  const handleKey = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) { setIsOpen(true); return }
        setHighlighted(prev => (prev + 1) % options.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) { setIsOpen(true); return }
        setHighlighted(prev => (prev <= 0 ? options.length - 1 : prev - 1))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!isOpen) { setIsOpen(true); return }
        if (highlighted >= 0 && highlighted < options.length) {
          onChange(options[highlighted].id)
          setIsOpen(false)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        triggerRef.current?.focus()
        break
      case 'Home':
        e.preventDefault()
        setHighlighted(0)
        break
      case 'End':
        e.preventDefault()
        setHighlighted(options.length - 1)
        break
    }
  }

  return (
    <div>
      <label id={labelId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative" ref={containerRef}>
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
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            aria-labelledby={labelId}
            className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-y-auto max-h-60"
          >
            {options.map((opt, idx) => (
              <li
                key={opt.id}
                role="option"
                aria-selected={opt.id === value}
                data-value={opt.id}
              >
                <button
                  type="button"
                  onClick={() => { onChange(opt.id); setIsOpen(false) }}
                  onMouseEnter={() => setHighlighted(idx)}
                  className={`w-full text-left px-4 py-3 sm:py-2.5 transition-colors cursor-pointer ${
                    idx === highlighted
                      ? 'bg-blue-100 dark:bg-blue-800/40'
                      : opt.id === value
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
