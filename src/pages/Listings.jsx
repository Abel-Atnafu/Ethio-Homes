import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FilterBar from '../components/FilterBar'
import PropertyGrid from '../components/PropertyGrid'
import { useProperties } from '../hooks/useProperties'
import { useLang } from '../App'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Listings() {
  const { t } = useLang()
  const [params, setParams] = useSearchParams()

  const city = params.get('city') || undefined
  const priceType = params.get('priceType') || undefined
  const propertyType = params.get('propertyType') || undefined
  const bedrooms = params.get('bedrooms') || undefined
  const minPrice = params.get('minPrice') || undefined
  const maxPrice = params.get('maxPrice') || undefined
  const page = parseInt(params.get('page') || '1', 10)

  const { properties, count, loading, error } = useProperties({
    city,
    priceType,
    propertyType,
    bedrooms,
    minPrice,
    maxPrice,
    page,
  })

  const totalPages = Math.max(1, Math.ceil(count / 12))

  function goToPage(n) {
    const next = new URLSearchParams(params)
    next.set('page', String(n))
    setParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <FilterBar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-stone-800">{t('all_listings')}</h1>
          {!loading && count > 0 && (
            <p className="text-sm text-stone-500">
              {count} {count === 1 ? 'property' : 'properties'}
            </p>
          )}
        </div>

        <PropertyGrid properties={properties} loading={loading} error={error} />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <span className="text-sm text-stone-500">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
