import './globals.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes"
import Header from '../components/Header'
import UserInit from '../components/UserInit'
import Toast from '../components/Toast'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'ZapasYA Feedback App',
  description: 'Plataforma de reseñas para compra y venta de zapatos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 pb-16 md:pb-0">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserInit />
            <Header />
            <Suspense fallback={null}>
              <Toast />
            </Suspense>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
