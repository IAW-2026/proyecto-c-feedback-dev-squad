'use client'

import { useState } from 'react'

type Size = 'sm' | 'md' | 'lg'

interface Props {
  rating: number
  onChange?: (rating: number) => void
  size?: Size
}

const sizeClasses: Record<Size, { star: string; container: string }> = {
  sm: { star: 'w-5 h-5 sm:w-4 sm:h-4', container: 'gap-1 sm:gap-0.5' },
  md: { star: 'w-6 h-6', container: 'gap-1' },
  lg: { star: 'w-8 h-8', container: 'gap-1.5' },
}

export default function StarRating({ rating, onChange, size = 'md' }: Props) {
  const { star, container } = sizeClasses[size]
  const [hovered, setHovered] = useState(0)

  const displayRating = hovered || rating

  return (
    <div
      className={`flex items-center ${container}`}
      role={onChange ? 'radiogroup' : 'img'}
      aria-label={`Calificación: ${rating} de 5 estrellas`}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map(starValue => (
        <button
          key={starValue}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(starValue)}
          onMouseEnter={() => onChange && setHovered(starValue)}
          onKeyDown={e => {
            if (onChange && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              onChange(starValue)
            }
          }}
          aria-label={`${starValue} estrella${starValue !== 1 ? 's' : ''}`}
          aria-checked={onChange ? starValue <= rating : undefined}
          className={`${star} ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <svg viewBox="0 0 24 24" fill={starValue <= displayRating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className={starValue <= displayRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      ))}
    </div>
  )
}
