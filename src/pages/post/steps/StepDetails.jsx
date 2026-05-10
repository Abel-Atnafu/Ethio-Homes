const AMENITIES = ['parking', 'generator', 'guard', 'water_tank', 'elevator', 'gym', 'pool', 'internet', 'furnished']

const inputClass = 'w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 bg-white'
const labelClass = 'block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5'

export default function StepDetails({ form, set, toggleAmenity, t }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>{t('beds')}</label>
          <input
            type="number"
            value={form.bedrooms}
            onChange={(e) => set('bedrooms', e.target.value)}
            className={inputClass}
            min="0"
            placeholder="3"
          />
        </div>
        <div>
          <label className={labelClass}>{t('baths')}</label>
          <input
            type="number"
            value={form.bathrooms}
            onChange={(e) => set('bathrooms', e.target.value)}
            className={inputClass}
            min="0"
            placeholder="2"
          />
        </div>
        <div>
          <label className={labelClass}>{t('area_sqm')}</label>
          <input
            type="number"
            value={form.area_sqm}
            onChange={(e) => set('area_sqm', e.target.value)}
            className={inputClass}
            min="0"
            placeholder="120"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('select_amenities')}</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {AMENITIES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors font-medium ${
                form.amenities.includes(a)
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'border-stone-200 text-stone-600 hover:border-terracotta hover:text-terracotta'
              }`}
            >
              {t(`amenity_${a}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
