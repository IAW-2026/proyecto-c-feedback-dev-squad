export default function CrearResenaPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Crear Reseña
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          ¿Qué deseas reseñar?
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Reseñar Producto
          </a>
          <a
            href="#"
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Reseñar Vendedor
          </a>
        </div>
      </div>
    </main>
  )
}
