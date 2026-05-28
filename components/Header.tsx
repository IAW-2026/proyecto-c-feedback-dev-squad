'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignInButton, SignUpButton, ClerkLoading, useAuth } from "@clerk/nextjs";
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { isSignedIn, isLoaded } = useAuth()
  const pathname = usePathname()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false)
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false)

  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const dashboardDropdownRef = useRef<HTMLDivElement>(null)
  const adminDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
      if (dashboardDropdownRef.current && !dashboardDropdownRef.current.contains(event.target as Node)) {
        setIsDashboardDropdownOpen(false)
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsProfileDropdownOpen(false)
        setIsDashboardDropdownOpen(false)
        setIsAdminDropdownOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleDashboardClick = () => {
    if (!isSignedIn) {
      window.location.href = '/sign-in'
      return
    }
    setIsDashboardDropdownOpen(!isDashboardDropdownOpen)
  }

  const handleAdminClick = () => {
    if (!isSignedIn) {
      window.location.href = '/sign-in'
      return
    }
    setIsAdminDropdownOpen(!isAdminDropdownOpen)
  }

  const navItems = [
    { href: '/', label: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/explorar', label: 'Explorar', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', requireAuth: true },
    { href: '/dashboard/crear-resena', label: 'Crear', icon: 'M12 4v16m8-8H4', requireAuth: true },
    { href: '/dashboard/mis-resenas', label: 'Mis reseñas', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', requireAuth: true },
    { href: '/admin/reportes', label: 'Admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', requireAuth: true },
  ]

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-14 md:h-16">
            <div className="col-start-1 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <img src="/icon.png" alt="ZapasYA" className="w-6 h-6 md:w-8 md:h-8 shrink-0 object-contain" />
                <span className="md:hidden text-base font-bold leading-none text-blue-600 dark:text-blue-400">Feedback</span>
                <div className="hidden md:flex md:flex-col">
                  <div className="flex items-baseline">
                    <span className="text-base font-bold leading-none text-gray-900 dark:text-white">Zapas</span>
                    <span className="text-base font-bold leading-none text-blue-600 dark:text-blue-400">YA Feedback</span>
                  </div>
                  <span className="text-[8px] tracking-[0.15em] text-gray-500 dark:text-gray-400 leading-none">MARKETPLACE DE ZAPATILLAS</span>
                </div>
              </Link>
            </div>

             <nav aria-label="Navegación principal" className="col-start-2 hidden md:flex items-center justify-center space-x-8 md:ml-6">
               <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                 Inicio
               </Link>
                <Link
                  href={isSignedIn ? '/explorar' : '/sign-in'}
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Explorar
                </Link>
               <div className="relative" ref={dashboardDropdownRef}>
                 <button
                   onClick={handleDashboardClick}
                   aria-haspopup="true"
                   aria-expanded={isDashboardDropdownOpen}
                   className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                 >
                    Mi cuenta
                     <svg className={`w-4 h-4 transition-transform duration-200 ${isDashboardDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                 </button>
                 {isSignedIn && isDashboardDropdownOpen && (
                   <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                     <Link href="/dashboard/crear-resena" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium" onClick={() => setIsDashboardDropdownOpen(false)}>
                       Crear Reseña
                     </Link>
                     <Link href="/dashboard/mis-resenas" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium" onClick={() => setIsDashboardDropdownOpen(false)}>
                       Mis Reseñas
                     </Link>
                   </div>
                 )}
               </div>
               <div className="relative" ref={adminDropdownRef}>
                 <button
                   onClick={handleAdminClick}
                   aria-haspopup="true"
                   aria-expanded={isAdminDropdownOpen}
                   className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                 >
                   Admin
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isAdminDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                 </button>
                 {isSignedIn && isAdminDropdownOpen && (
                   <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                     <Link href="/admin/reportes" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium" onClick={() => setIsAdminDropdownOpen(false)}>
                       Reportes
                     </Link>
                   </div>
                 )}
               </div>
             </nav>

             <div className="col-start-3 flex items-center justify-end space-x-4">
               <ThemeToggle />

                <div className="flex items-center min-w-[48px] min-h-[40px] justify-center">
                  {!isLoaded ? (
                    <div className="w-10 h-10 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700" />
                  ) : isSignedIn ? (
                    <UserButton />
                  ) : (
                    <div className="relative" ref={profileDropdownRef}>
                      <button
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        aria-label="Perfil"
                        aria-haspopup="true"
                        aria-expanded={isProfileDropdownOpen}
                        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </button>
                      {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                          <SignInButton mode="modal">
                            <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                               Iniciar Sesión
                             </button>
                           </SignInButton>
                           <SignUpButton mode="modal">
                             <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                               Registrarse
                            </button>
                          </SignUpButton>
                        </div>
                      )}
                    </div>
                  )}
                </div>
             </div>
           </div>
         </div>
       </header>

      <nav aria-label="Navegación móvil" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-around h-16">
          {navItems.map(item => {
            if (item.requireAuth && !isSignedIn) return null
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 h-full px-3 min-w-[60px] transition-colors ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="md:hidden h-16" />
    </>
  )
}
