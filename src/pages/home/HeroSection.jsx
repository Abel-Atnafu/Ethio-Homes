import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'

const CITIES = ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Hawassa', 'Adama']
const HERO_BG = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80'

export default function HeroSection() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [searchCity, setSearchCity] = useState('')
  const [searchType, setSearchType] = useState('rent')

  function handleSearch() {
    const params = new URLSearchParams()
    if (searchCity) params.set('city', searchCity)
    params.set('priceType', searchType)
    navigate(`/listings?${params.toString()}`)
  }

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      <img
        src={HERO_BG}
        alt="Ethiopian cityscape"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-stone-900/90 via-stone-900/70 to-terracotta/60"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #FDF6EC 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/80 text-xs font-medium">500+ verified listings across Ethiopia</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
          {t('hero_title')}
        </h1>
        <p className="text-stone-300 text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
          {t('hero_subtitle')}
        </p>

        <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
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

          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 bg-terracotta hover:bg-orange-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-terracotta/30"
          >
            <Search size={18} /> {t('search_button')}
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 mt-10">
          {[['500+', 'Listings'], ['200+', 'Agents'], ['10+', 'Cities']].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="text-white font-bold text-xl">{val}</div>
              <div className="text-white/50 text-xs">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
