import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main>
      <div className="page-content">
        <h1>Iniciar Sesión</h1>
        <SignIn />
      </div>
    </main>
  )
}
