import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BedDouble, Bath, Maximize2, MapPin, ChevronLeft, ChevronRight, MessageCircle, Phone, Home } from 'lucide-react'
import { useLang } from '../contexts/LangContext'
import { useProperties } from '../hooks/useProperties'
import { supabase } from '../lib/supabase'
import PageWrapper from '../components/layout/PageWrapper'
import MapView from '../components/MapView'
import AgentContactModal from '../components/AgentContactModal'
import PropertyGrid from '../components/PropertyGrid'

function whatsappUrl(phone, title) {
  const msg = encodeURIComponent(`Hi, I'm interested in your listing: "${title}" on EthioHomes.`)
  return `https://wa.me/251${phone}?text=${msg}`
}

function formatPrice(price, period) {
  const formatted = new Intl.NumberFormat('en-ET').format(price)
  const suffix = period === 'monthly' ? '/mo' : period === 'yearly' ? '/yr' : ''
  return `ETB ${formatted}${suffix}`
}

const AMENITY_KEYS = {
  parking: 'amenity_parking', generator: 'amenity_generator', guard: 'amenity_guard',
  water_tank: 'amenity_water_tank', elevator: 'amenity_elevator', gym: 'amenity_gym',
  pool: 'amenity_pool', internet: 'amenity_internet', furnished: 'amenity_furnished',
}

function LoadingSkeleton() {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-4 w-32 bg-stone-200 rounded mb-6" />
        <div className="aspect-video bg-stone-200 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-24 bg-stone-200 rounded-full" />
            <div className="h-8 w-3/4 bg-stone-200 rounded" />
            <div className="h-4 w-1/2 bg-stone-200 rounded" />
            <div className="h-6 w-1/3 bg-stone-200 rounded" />
            <div className="flex gap-6 py-4 border-t border-b border-stone-100">
              {[1, 2, 3].map((i) => <div key={i} className="h-6 w-20 bg-stone-200 rounded" />)}
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-4 bg-stone-200 rounded" style={{ width: `${100 - i * 10}%` }} />)}
            </div>
          </div>
          <div className="h-64 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    </PageWrapper>
  )
}

export default function PropertyDetail() {
  const { id } = useParams()
  const { t } = useLang()

  const [property, setProperty] = useState(null)
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgIndex, setImgIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      setProperty(data)

      if (data?.agent_id) {
        const { data: agentData } = await supabase
          .from('agents')
          .select('*')
          .eq('id', data.agent_id)
          .single()
        setAgent(agentData)
      }

      setLoading(false)
    }
    load()
  }, [id])

  const { properties: similar, loading: simLoading } = useProperties(
    property
      ? { similarTo: { city: property.city, property_type: property.property_type, id: property.id } }
      : {}
  )

  if (loading) return <LoadingSkeleton />

  if (!property) {
    return (
      <PageWrapper>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4">
          <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center">
            <Home size={36} className="text-stone-400" />
          </div>
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-stone-700 mb-2">Property not found</h2>
            <p className="text-stone-400 text-sm mb-6">This listing may have been removed or the URL is incorrect.</p>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 bg-terracotta text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-800 transition-colors text-sm"
            >
              ← Browse listings
            </Link>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const images = property.images || []
  const prevImg = () => setImgIndex((i) => (i - 1 + images.length) % images.length)
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length)

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/listings"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-terracotta mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Back to listings
        </Link>

        {/* Image carousel */}
        <div className="relative rounded-2xl overflow-hidden bg-stone-200 aspect-video mb-8 shadow-lg">
          {images.length > 0 ? (
            <>
              <img
                src={images[imgIndex]}
                alt={`${property.title} - image ${imgIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {imgIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              {t('no_images')}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${
                  property.price_type === 'rent' ? 'bg-terracotta' : 'bg-stone-800'
                }`}>
                  {property.price_type === 'rent' ? t('for_rent') : t('for_sale')}
                </span>
                <span className="text-xs text-stone-400 capitalize bg-stone-100 px-2.5 py-1 rounded-full">
                  {property.property_type}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-800 leading-tight mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-3">
                <MapPin size={14} className="text-terracotta shrink-0" />
                <span>{[property.woreda, property.subcity, property.city].filter(Boolean).join(', ')}</span>
              </div>
              <div className="text-gold font-bold text-2xl">
                {formatPrice(property.price, property.price_period)}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 py-5 border-t border-b border-stone-100">
              {property.bedrooms && (
                <div className="flex items-center gap-2 text-stone-600">
                  <BedDouble size={18} className="text-terracotta" />
                  <span className="font-semibold">{property.bedrooms}</span>
                  <span className="text-sm">{t('bedrooms')}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2 text-stone-600">
                  <Bath size={18} className="text-terracotta" />
                  <span className="font-semibold">{property.bathrooms}</span>
                  <span className="text-sm">{t('bathrooms')}</span>
                </div>
              )}
              {property.area_sqm && (
                <div className="flex items-center gap-2 text-stone-600">
                  <Maximize2 size={18} className="text-terracotta" />
                  <span className="font-semibold">{property.area_sqm}</span>
                  <span className="text-sm">{t('sqm')}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h3 className="font-display font-semibold text-xl text-stone-800 mb-3">{t('description')}</h3>
                <p className="text-stone-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-xl text-stone-800 mb-3">{t('amenities')}</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="bg-terracotta/10 text-terracotta text-sm font-medium px-3.5 py-1.5 rounded-full">
                      {t(AMENITY_KEYS[a]) || a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <MapView lat={property.lat} lng={property.lng} title={property.title} />
          </div>

          {/* Agent card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 sticky top-24">
              <h3 className="font-semibold text-stone-500 mb-4 text-xs uppercase tracking-widest">
                {t('contact_agent')}
              </h3>

              <div className="flex items-center gap-3 mb-5">
                {agent?.avatar_url ? (
                  <img src={agent.avatar_url} alt={agent?.full_name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-bold text-lg">
                    {(agent?.full_name || property.agent_name)?.[0] ?? 'A'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{agent?.full_name || property.agent_name}</p>
                  {agent?.agency_name && (
                    <p className="text-xs text-stone-500">{agent.agency_name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <a
                  href={whatsappUrl(agent?.whatsapp || agent?.phone || property.agent_phone, property.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors w-full text-sm"
                >
                  <MessageCircle size={17} /> {t('whatsapp')}
                </a>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2 border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold py-3 rounded-xl transition-colors w-full text-sm"
                >
                  <Phone size={16} /> {t('contact_agent')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-stone-800 mb-6">{t('similar_properties')}</h2>
            <PropertyGrid properties={similar} loading={simLoading} />
          </section>
        )}
      </div>

      {showModal && (
        <AgentContactModal
          agent={agent || { full_name: property.agent_name, phone: property.agent_phone }}
          title={property.title}
          onClose={() => setShowModal(false)}
        />
      )}
    </PageWrapper>
  )
}
