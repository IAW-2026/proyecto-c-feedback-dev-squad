import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <section className="min-h-[calc(100dvh-8rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
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
    </section>
  )
}
