import { auth } from '@clerk/nextjs/server'

export default async function Dashboard() {
  const { userId } = await auth()

  return (
    <main>
      <div className="page-content">
        <span className="page-label page-label-dashboard">Dashboard</span>
        <h1>Panel de Control</h1>
        <p className="page-description">Bienvenido al dashboard de ZapasYA.</p>
        <p className="page-email">{userId}</p>
      </div>
    </main>
  )
}
