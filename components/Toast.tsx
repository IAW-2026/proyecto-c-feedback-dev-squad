'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function Toast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasError = searchParams.get('error') === 'no_privileges'
    
    if (hasError) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        router.replace('/')
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [searchParams, router])

  const closeToast = () => {
    setVisible(false)
    router.replace('/')
  }

  if (!visible) return null

  return (
    <div className="fixed top-20 right-4 z-[100] animate-slide-in">
      <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl shadow-lg min-w-[320px]">
        <svg className="w-6 h-6 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="flex-1 text-sm font-medium">No tienes privilegios para entrar a esa sección</p>
        <button onClick={closeToast} className="flex-shrink-0 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg p-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
