import { auth } from '@clerk/nextjs/server'

export default async function Admin() {
  const { userId } = await auth()

  return (
    <main>
      <div className="page-content">
        <span className="page-label page-label-admin">Admin</span>
        <h1>Panel de Administración</h1>
        <p className="page-description">Acceso restringido - zona administrativa.</p>
        <p className="page-email">{userId}</p>
      </div>
    </main>
  )
}
