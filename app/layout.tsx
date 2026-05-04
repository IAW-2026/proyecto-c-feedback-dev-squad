import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feedback App - ZapasYA',
  description: 'Aplicación de feedback para el marketplace ZapasYA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
