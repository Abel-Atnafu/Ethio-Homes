import PropertyCard from './PropertyCard'
import { useLang } from '../App'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 animate-pulse">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-stone-200 rounded w-2/3" />
        <div className="h-4 bg-stone-200 rounded w-full" />
        <div className="h-4 bg-stone-200 rounded w-1/2" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-stone-200 rounded-xl flex-1" />
          <div className="h-9 bg-stone-200 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  )
}

export default function PropertyGrid({ properties, loading, error }) {
  const { t } = useLang()

  if (error) {
    return (
      <div className="text-center py-16 text-stone-500">
        <p>Failed to load listings. Please try again.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!properties.length) {
    return (
      <div className="text-center py-16 text-stone-500">
        <p className="text-lg">{t('no_listings')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  )
}
