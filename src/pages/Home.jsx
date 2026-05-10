import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Eye, MessageCircle, Home as HomeIcon } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyGrid from '../components/PropertyGrid'
import { useProperties } from '../hooks/useProperties'
import { useLang } from '../App'

const CITIES = ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Hawassa', 'Adama']

export default function Home() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [searchCity, setSearchCity] = useState('')
  const [searchType, setSearchType] = useState('rent')

  const { properties: featured, loading, error } = useProperties({ featured: true, limit: 6 })

  function handleSearch() {
    const params = new URLSearchParams()
    if (searchCity) params.set('city', searchCity)
    params.set('priceType', searchType)
    navigate(`/listings?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-terracotta/80"
          aria-hidden="true"
        />
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #FDF6EC 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
            {t('hero_title')}
          </h1>
          <p className="text-stone-300 text-lg sm:text-xl mb-10 leading-relaxed">
            {t('hero_subtitle')}
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            {/* City */}
            <div className="relative flex-1">
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pr-8 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              >
                <option value="">{t('all_cities')}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>

            {/* Type toggle */}
            <div className="flex rounded-xl overflow-hidden border border-stone-200">
              {['rent', 'sale'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`px-5 py-3 text-sm font-semibold transition-colors ${
                    searchType === type
                      ? 'bg-terracotta text-white'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {type === 'rent' ? t('rent') : t('buy')}
                </button>
              ))}
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-terracotta hover:bg-orange-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Search size={18} /> {t('search_button')}
            </button>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl font-bold text-stone-800 mb-8">
          {t('featured_listings')}
        </h2>
        <PropertyGrid properties={featured} loading={loading} error={error} />
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/listings')}
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-orange-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
          >
            {t('all_listings')} →
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone-50 border-t border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-stone-800 text-center mb-12">
            {t('how_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Eye size={32} />, titleKey: 'step1_title', descKey: 'step1_desc', num: '01' },
              { icon: <MessageCircle size={32} />, titleKey: 'step2_title', descKey: 'step2_desc', num: '02' },
              { icon: <HomeIcon size={32} />, titleKey: 'step3_title', descKey: 'step3_desc', num: '03' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-terracotta/10 text-terracotta mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-terracotta mb-1 tracking-widest">{step.num}</div>
                <h3 className="font-display font-bold text-xl text-stone-800 mb-2">{t(step.titleKey)}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
