'use client'

import { useSearchParams } from 'next/navigation'

export default function HideOnToken({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  if (searchParams?.get('token')) return null
  return <>{children}</>
}
