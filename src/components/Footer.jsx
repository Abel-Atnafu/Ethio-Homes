import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="bg-stone-900 text-stone-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img src="/logo.svg" alt="EthioHomes" className="h-9 w-auto mb-3 brightness-0 invert" />
            <p className="text-sm text-stone-400 leading-relaxed">{t('footer_tagline')}</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{t('footer_quick_links')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-gold transition-colors">{t('nav_home')}</Link></li>
              <li><Link to="/listings" className="hover:text-gold transition-colors">{t('nav_listings')}</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">{t('nav_login')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{t('footer_contact')}</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>Addis Ababa, Ethiopia</li>
              <li>info@ethiohomes.et</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-6 text-center text-xs text-stone-500">
          {t('footer_rights')}
        </div>
      </div>
    </footer>
  )
}
