const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'commercial', 'land']

const inputClass = 'w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 bg-white'
const labelClass = 'block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5'

export default function StepBasic({ form, set, t }) {
  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>{t('listing_title')}</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className={inputClass}
          placeholder="Spacious 3BR Apartment in Bole"
          required
        />
      </div>

      <div>
        <label className={labelClass}>{t('price_type')}</label>
        <div className="flex rounded-xl overflow-hidden border border-stone-200">
          {['rent', 'sale'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => set('price_type', type)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                form.price_type === type
                  ? 'bg-terracotta text-white'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {type === 'rent' ? t('for_rent') : t('for_sale')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('price')}</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            className={inputClass}
            placeholder="25000"
            min="0"
            required
          />
        </div>
        {form.price_type === 'rent' && (
          <div>
            <label className={labelClass}>{t('price_period')}</label>
            <select
              value={form.price_period}
              onChange={(e) => set('price_period', e.target.value)}
              className={inputClass}
            >
              <option value="monthly">{t('monthly')}</option>
              <option value="yearly">{t('yearly')}</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>{t('filter_property_type')}</label>
        <select
          value={form.property_type}
          onChange={(e) => set('property_type', e.target.value)}
          className={inputClass}
        >
          {PROPERTY_TYPES.map((pt) => (
            <option key={pt} value={pt}>{t(`type_${pt}`)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{t('description')}</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className={`${inputClass} min-h-[100px] resize-none`}
          placeholder="Describe the property — condition, nearby landmarks, access to services..."
        />
      </div>
    </div>
  )
}
