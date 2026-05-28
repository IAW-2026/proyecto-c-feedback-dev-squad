import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Página no encontrada
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </main>
  )
}
