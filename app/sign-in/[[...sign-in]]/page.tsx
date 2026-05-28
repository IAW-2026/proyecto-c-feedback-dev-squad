import type { Metadata } from 'next'
import { SignIn } from '@clerk/nextjs'
import { clerkAppearance } from '../../../lib/clerk-appearance'

export const metadata: Metadata = {
  title: 'Iniciar sesión — ZapasYA',
  description: 'Iniciá sesión para calificar productos y vendedores en ZapasYA.',
}

export default function SignInPage() {
  return (
    <section className="min-h-[calc(100dvh-8rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <SignIn appearance={clerkAppearance} />
      </div>
    </section>
  )
}
