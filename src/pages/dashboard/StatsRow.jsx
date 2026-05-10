import { useLang } from '../../contexts/LangContext'

export default function StatsRow({ total, active }) {
  const { t } = useLang()
  const inactive = total - active

  const stats = [
    { label: t('total_listings'), value: total, color: 'text-stone-800' },
    { label: t('active_listings'), value: active, color: 'text-green-600' },
    { label: t('inactive_listings'), value: inactive, color: 'text-stone-400' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  )
}
