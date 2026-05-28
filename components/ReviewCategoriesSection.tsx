interface CategoryItem {
  label: string
  description: string
}

interface Category {
  icon: React.ReactNode
  title: string
  items: CategoryItem[]
}

interface ReviewCategoriesSectionProps {
  heading: string
  categories: Category[]
}

export default function ReviewCategoriesSection({
  heading,
  categories,
}: ReviewCategoriesSectionProps) {
  return (
    <section className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 md:mb-12">
          {heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center shrink-0">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {category.items.map(({ label, description }) => (
                  <li key={label} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
