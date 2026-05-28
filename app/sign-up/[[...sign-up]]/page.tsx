import type { Metadata } from 'next'
import { SignUp } from '@clerk/nextjs'
import { clerkAppearance } from '../../../lib/clerk-appearance'

export const metadata: Metadata = {
  title: 'Crear cuenta — ZapasYA',
  description: 'Creá tu cuenta en ZapasYA y empezá a calificar productos y vendedores.',
}

export default function SignUpPage() {
  return (
    <section className="min-h-[calc(100dvh-8rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <SignUp appearance={clerkAppearance} />
      </div>
    </section>
  )
}
