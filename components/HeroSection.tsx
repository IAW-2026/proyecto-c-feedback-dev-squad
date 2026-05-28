interface HeroSectionProps {
  title: React.ReactNode
  subtitle: string
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 md:py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-3xl sm:text-6xl md:text-7xl font-bold leading-none">
            {title}
          </span>
        </div>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
