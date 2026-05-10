import { useNavigate } from 'react-router-dom'
import { useLang } from '../../contexts/LangContext'
import { useProperties } from '../../hooks/useProperties'
import PageWrapper from '../../components/layout/PageWrapper'
import PropertyGrid from '../../components/PropertyGrid'
import HeroSection from './HeroSection'
import HowItWorks from './HowItWorks'

export default function Home() {
  const { t } = useLang()
  const navigate = useNavigate()
  const { properties: featured, loading, error } = useProperties({ featured: true, limit: 6 })

  return (
    <PageWrapper>
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-stone-800">
            {t('featured_listings')}
          </h2>
          <button
            onClick={() => navigate('/listings')}
            className="text-sm font-semibold text-terracotta hover:text-orange-800 transition-colors"
          >
            View all →
          </button>
        </div>

        <PropertyGrid properties={featured} loading={loading} error={error} />

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/listings')}
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-orange-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-terracotta/25"
          >
            {t('all_listings')} →
          </button>
        </div>
      </section>

      <HowItWorks />
    </PageWrapper>
  )
}
