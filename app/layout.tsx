import './globals.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes"
import Header from '../components/Header'
import Toast from '../components/Toast'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Feedback App',
  description: 'Aplicación de feedback para el marketplace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('theme');
                    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.documentElement.classList.add('dark');
                    }
                  } catch(e) {}
                })();
              `,
            }}
          />
        </head>
        <body className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 pb-16 md:pb-0">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <Suspense fallback={null}>
              <Toast />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
