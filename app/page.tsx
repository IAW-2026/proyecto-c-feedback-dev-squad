import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <div className="page-content">
        <h1>ZapasYA Feedback App</h1>
        <p className="subtitle">Aplicación base para comenzar la etapa 2 del proyecto.</p>
        <nav className="nav-links">
          <Link href="/dashboard" className="nav-btn nav-btn-primary">Dashboard</Link>
          <Link href="/admin" className="nav-btn nav-btn-danger">Admin</Link>
        </nav>
      </div>
    </main>
  )
}