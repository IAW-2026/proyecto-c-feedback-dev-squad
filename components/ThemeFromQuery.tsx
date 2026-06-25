'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function ThemeFromQuery() {
  const searchParams = useSearchParams()
  const { setTheme } = useTheme()
  const applied = useRef(false)

  useEffect(() => {
    if (applied.current) return
    const theme = searchParams.get('theme')
    if (theme === 'light' || theme === 'dark') {
      setTheme(theme)
      applied.current = true
    }
  }, [searchParams, setTheme])

  return null
}
