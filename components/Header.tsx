'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { UserButton, SignInButton, SignUpButton, Show, ClerkLoading, ClerkLoaded, useAuth } from "@clerk/nextjs";
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { isSignedIn } = useAuth()
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

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Feedback App
            </Link>
          </div>

           <nav className="hidden md:flex items-center space-x-8">
             <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
               Inicio
             </Link>
             <div className="relative" ref={dashboardDropdownRef}>
               <button
                 onClick={handleDashboardClick}
                 className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
               >
                 Dashboard
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isDashboardDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                 className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
               >
                 Admin
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isAdminDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

           <div className="flex items-center space-x-4">
             <ThemeToggle />

             <div className="flex items-center min-w-[48px] justify-center">
               <ClerkLoading>
                 <div className="w-10 h-10 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700" />
               </ClerkLoading>
               <ClerkLoaded>
                 <Show when="signed-out">
                   <div className="relative" ref={profileDropdownRef}>
                     <button
                       onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                       className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                     >
                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                       </svg>
                     </button>
                     {isProfileDropdownOpen && (
                       <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                         <SignInButton mode="modal">
                           <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                             Sign In
                           </button>
                         </SignInButton>
                         <SignUpButton mode="modal">
                           <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                             Sign Up
                           </button>
                         </SignUpButton>
                       </div>
                     )}
                   </div>
                 </Show>
                 <Show when="signed-in">
                   <UserButton />
                 </Show>
               </ClerkLoaded>
             </div>
           </div>
         </div>
       </div>
     </header>
   )
 }
