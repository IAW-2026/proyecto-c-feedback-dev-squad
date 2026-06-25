'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function ThemeFromQuery() {
  const searchParams = useSearchParams()
  const { setTheme } = useTheme()

  useEffect(() => {
    const theme = searchParams.get('theme')
    if (theme === 'light' || theme === 'dark') {
      setTheme(theme)
    }
  }, [searchParams, setTheme])

  return null
}
