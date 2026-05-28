import type { Appearance } from '@clerk/nextjs/server'

export const clerkAppearance: Appearance = {
  elements: {
    headerTitle: 'text-gray-900 dark:text-white text-2xl font-bold',
    headerSubtitle: 'text-gray-600 dark:text-gray-300',
    socialButtonsBlockButton:
      'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600',
    formFieldInput:
      'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500',
    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    footerActionLink:
      'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
  },
}
