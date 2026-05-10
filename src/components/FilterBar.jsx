import { useSearchParams } from 'react-router-dom'
import { useLang } from '../App'

const CITIES = ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Hawassa', 'Adama']
const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'commercial', 'land']
const BEDROOM_OPTIONS = ['1', '2', '3', '4+']

export default function FilterBar() {
  const { t } = useLang()
  const [params, setParams] = useSearchParams()

  function update(key, value) {
    const next = new URLSearchParams(params)
    if (value && value !== 'all' && value !== 'any') {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    next.delete('page') // reset to page 1 on filter change
    setParams(next)
  }

  function reset() {
    setParams({})
  }

  const city = params.get('city') || 'all'
  const priceType = params.get('priceType') || 'all'
  const propertyType = params.get('propertyType') || 'all'
  const bedrooms = params.get('bedrooms') || 'any'
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''

  const hasFilters = city !== 'all' || priceType !== 'all' || propertyType !== 'all' ||
    bedrooms !== 'any' || minPrice || maxPrice

  return (
    <div className="bg-white border-b border-stone-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap gap-3 items-end">
          {/* City */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-stone-500 font-medium">{t('filter_city')}</label>
            <select
              value={city}
              onChange={(e) => update('city', e.target.value)}
              className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            >
              <option value="all">{t('filter_all')}</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Rent / Sale */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-stone-500 font-medium">{t('filter_type')}</label>
            <div className="flex rounded-lg overflow-hidden border border-stone-200">
              {['all', 'rent', 'sale'].map((type) => (
                <button
                  key={type}
                  onClick={() => update('priceType', type)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    priceType === type
                      ? 'bg-terracotta text-white'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {type === 'all' ? t('filter_all') : type === 'rent' ? t('for_rent') : t('for_sale')}
                </button>
              ))}
            </div>
          </div>

          {/* Property type */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-stone-500 font-medium">{t('filter_property_type')}</label>
            <select
              value={propertyType}
              onChange={(e) => update('propertyType', e.target.value)}
              className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            >
              <option value="all">{t('filter_all')}</option>
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt} value={pt}>{t(`type_${pt}`)}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-stone-500 font-medium">{t('filter_bedrooms')}</label>
            <div className="flex rounded-lg overflow-hidden border border-stone-200">
              <button
                onClick={() => update('bedrooms', 'any')}
                className={`px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  bedrooms === 'any' ? 'bg-terracotta text-white' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {t('filter_any')}
              </button>
              {BEDROOM_OPTIONS.map((b) => (
                <button
                  key={b}
                  onClick={() => update('bedrooms', b)}
                  className={`px-2.5 py-1.5 text-sm font-medium transition-colors border-l border-stone-200 ${
                    bedrooms === b ? 'bg-terracotta text-white' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-stone-500 font-medium">{t('filter_min_price')}</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => update('minPrice', e.target.value)}
              className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-stone-500 font-medium">{t('filter_max_price')}</label>
            <input
              type="number"
              placeholder="∞"
              value={maxPrice}
              onChange={(e) => update('maxPrice', e.target.value)}
              className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            />
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={reset}
              className="text-sm text-terracotta hover:underline font-medium self-end pb-1.5"
            >
              {t('filter_reset')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
