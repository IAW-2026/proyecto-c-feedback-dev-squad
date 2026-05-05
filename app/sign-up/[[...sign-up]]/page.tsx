import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main>
      <div className="page-content">
        <h1>Registrarse</h1>
        <SignUp />
      </div>
    </main>
  )
}
