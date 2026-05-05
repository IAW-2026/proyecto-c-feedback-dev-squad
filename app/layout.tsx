import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ClerkProvider, UserButton, Show } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: 'Feedback App - ZapasYA',
  description: 'Aplicación de feedback para el marketplace ZapasYA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ClerkProvider>
          <header>
            <Link href="/" className="header-brand">ZapasYA</Link>
            <div className="header-right">
              <Show when="signed-out">
                <span className="auth-status auth-status-signed-out">No autenticado</span>
                <div className="auth-buttons">
                  <a href="/sign-in" className="nav-btn nav-btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    Iniciar Sesión
                  </a>
                  <a href="/sign-up" className="nav-btn nav-btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    Registrarse
                  </a>
                </div>
              </Show>
              <Show when="signed-in">
                <span className="auth-status auth-status-signed-in">Autenticado</span>
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
