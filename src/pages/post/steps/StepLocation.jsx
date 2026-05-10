const CITIES = ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Hawassa', 'Adama']

const inputClass = 'w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 bg-white'
const labelClass = 'block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5'

export default function StepLocation({ form, set, t }) {
  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>{t('city')}</label>
        <select
          value={form.city}
          onChange={(e) => set('city', e.target.value)}
          className={inputClass}
        >
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>{t('subcity')}</label>
        <input
          type="text"
          value={form.subcity}
          onChange={(e) => set('subcity', e.target.value)}
          className={inputClass}
          placeholder="e.g. Bole, Kirkos, Yeka..."
        />
      </div>

      <div>
        <label className={labelClass}>{t('woreda')}</label>
        <input
          type="text"
          value={form.woreda}
          onChange={(e) => set('woreda', e.target.value)}
          className={inputClass}
          placeholder="e.g. 03"
        />
      </div>
    </div>
  )
}
