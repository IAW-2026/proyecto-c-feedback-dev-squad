'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { ensureUserAction } from '../app/actions'

export default function UserInit() {
  const { userId, isSignedIn } = useAuth()

  useEffect(() => {
    if (isSignedIn && userId) {
      ensureUserAction()
    }
  }, [isSignedIn, userId])

  return null
}
