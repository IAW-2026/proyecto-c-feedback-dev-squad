import { Suspense } from 'react'
import HeroSection from '../components/HeroSection'
import StepsSection from '../components/StepsSection'
import ReviewCategoriesSection from '../components/ReviewCategoriesSection'
import StatsSection from '../components/StatsSection'
import StatsSkeleton from '../components/StatsSkeleton'

export const revalidate = 1800

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Elegí',
    description: 'Buscá el producto o vendedor que querés calificar. Seleccioná el par que compraste.',
    icon: (
      <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'Calificá',
    description: 'Puntualo del 1 al 5 y contá tu experiencia: confort, calidad, talle y atención recibida.',
    icon: (
      <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: 'Compartí',
    description: 'Tu opinión ayuda a otros sneakerheads a decidir su próxima compra.',
    icon: (
      <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

const REVIEW_CATEGORIES = [
  {
    title: 'Productos',
    icon: (
      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    items: [
      { label: 'Confort y ajuste', description: '¿Son cómodas? ¿Calzan bien?' },
      { label: 'Calidad de materiales', description: '¿Se sientes duraderas? ¿Los materiales son buenos?' },
      { label: 'Talle', description: '¿Vienen justo, grandes o chicos?' },
      { label: 'Diseño', description: '¿Coincide con las fotos del anuncio?' },
    ],
  },
  {
    title: 'Vendedores',
    icon: (
      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    items: [
      { label: 'Atención y comunicación', description: '¿Respondieron rápido? ¿Fueron claros?' },
      { label: 'Rapidez del envío', description: '¿Llegó en el tiempo estimado?' },
      { label: 'Embalaje', description: '¿El producto llegó bien protegido?' },
      { label: 'Recomendación', description: '¿Volverías a comprarle?' },
    ],
  },
]

export default async function Home() {
  return (
    <main className="min-h-[calc(100vh-8rem)]">
      <HeroSection
        title={
          <>
            <span className="text-gray-900 dark:text-white">Zapas</span>
            <span className="text-blue-600 dark:text-blue-400">YA Reseñas</span>
          </>
        }
        subtitle="Opiniones reales de la comunidad. Calificá el confort, talle y calidad de tus zapatillas, y ayudá a otros a comprar con confianza."
      />

      <StepsSection heading="¿Cómo funciona?" steps={HOW_IT_WORKS_STEPS} />

      <ReviewCategoriesSection
        heading="Reseñá productos o vendedores"
        categories={REVIEW_CATEGORIES}
      />

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>
    </main>
  )
}
