export default function Home() {
  return (
    <main className="min-h-[calc(100vh-8rem)]">
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Reseñas <span className="text-blue-600 dark:text-blue-400">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Descubre reseñas reales de productos y vendedores. Ayuda a otros con tu experiencia.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Busca</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Encuentra el producto o vendedor que quieres reseñar.
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Reseña</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comparte tu experiencia con una calificación y comentario.
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ayuda</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tus reseñas ayudan a otros a tomar mejores decisiones.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800/50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            En números
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">1,200+</p>
              <p className="text-gray-600 dark:text-gray-300">Reseñas publicadas</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</p>
              <p className="text-gray-600 dark:text-gray-300">Usuarios activos</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">800+</p>
              <p className="text-gray-600 dark:text-gray-300">Productos reseñados</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
