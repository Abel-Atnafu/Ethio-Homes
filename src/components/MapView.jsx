import { useLang } from '../App'

export default function MapView({ lat, lng, title }) {
  const { t } = useLang()

  if (!lat || !lng) return null

  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`

  return (
    <div className="mt-6">
      <h3 className="font-display font-semibold text-xl text-stone-800 mb-3">{t('location')}</h3>
      <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
        <iframe
          title={`Map for ${title}`}
          src={src}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
