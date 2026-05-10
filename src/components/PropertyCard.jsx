import { Link } from 'react-router-dom'
import { BedDouble, Bath, MapPin, MessageCircle } from 'lucide-react'
import { useLang } from '../App'
import { PLACEHOLDER } from '../lib/placeholderImages'

function formatPrice(price, period) {
  const formatted = new Intl.NumberFormat('en-ET').format(price)
  const suffix = period === 'monthly' ? '/mo' : period === 'yearly' ? '/yr' : ''
  return `ETB ${formatted}${suffix}`
}

function whatsappUrl(phone, title) {
  const msg = encodeURIComponent(`Hi, I'm interested in your listing: "${title}" on EthioHomes.`)
  return `https://wa.me/251${phone}?text=${msg}`
}

export default function PropertyCard({ property }) {
  const { t } = useLang()

  const {
    id,
    title,
    price,
    price_type,
    price_period,
    city,
    subcity,
    bedrooms,
    bathrooms,
    images,
    agent_phone,
    property_type,
  } = property

  const image = images?.[0] ?? PLACEHOLDER[property_type] ?? PLACEHOLDER.default

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badge */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white ${
          price_type === 'rent' ? 'bg-terracotta' : 'bg-stone-800'
        }`}>
          {price_type === 'rent' ? t('for_rent') : t('for_sale')}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Price */}
        <div className="text-gold font-bold text-lg leading-tight">
          {formatPrice(price, price_period)}
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-stone-800 text-base leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-stone-500 text-sm">
          <MapPin size={13} className="shrink-0" />
          <span className="truncate">{subcity ? `${subcity}, ${city}` : city}</span>
        </div>

        {/* Bed / Bath */}
        {(bedrooms || bathrooms) && (
          <div className="flex items-center gap-4 text-stone-600 text-sm">
            {bedrooms && (
              <span className="flex items-center gap-1">
                <BedDouble size={14} /> {bedrooms} {t('bedrooms')}
              </span>
            )}
            {bathrooms && (
              <span className="flex items-center gap-1">
                <Bath size={14} /> {bathrooms} {t('bathrooms')}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          <a
            href={whatsappUrl(agent_phone, title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
          >
            <MessageCircle size={15} /> {t('whatsapp')}
          </a>
          <Link
            to={`/property/${id}`}
            className="flex-1 flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold py-2 rounded-xl transition-colors"
          >
            {t('view_details')}
          </Link>
        </div>
      </div>
    </div>
  )
}
