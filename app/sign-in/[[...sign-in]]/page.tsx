import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="min-h-screen md:min-h-[calc(100vh-8rem)] flex items-start md:items-center justify-center px-4 pt-8 pb-4 md:py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 hidden md:block">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Accede a tu cuenta de Feedback App
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <SignIn 
            appearance={{
              elements: {
                card: "shadow-none border-0",
                headerTitle: "text-gray-900 dark:text-white text-2xl font-bold",
                headerSubtitle: "text-gray-600 dark:text-gray-300",
                socialButtonsBlockButton: "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600",
                formFieldInput: "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
              }
            }}
          />
        </div>
      </div>
    </main>
  )
}
