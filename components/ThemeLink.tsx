'use client'

import { useTheme } from 'next-themes'

interface Props {
  href: string
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}

export default function ThemeLink({ href, children, className, 'aria-label': ariaLabel }: Props) {
  const { resolvedTheme } = useTheme()

  const separator = href.includes('?') ? '&' : '?'
  const themedHref = resolvedTheme
    ? `${href}${separator}theme=${resolvedTheme}`
    : href

  return (
    <a href={themedHref} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
