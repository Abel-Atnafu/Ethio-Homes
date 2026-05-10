import { X, MessageCircle, Phone } from 'lucide-react'
import { useLang } from '../contexts/LangContext'

function whatsappUrl(phone, title) {
  const msg = encodeURIComponent(`Hi, I'm interested in your listing: "${title}" on EthioHomes.`)
  return `https://wa.me/251${phone}?text=${msg}`
}

export default function AgentContactModal({ agent, title, onClose }) {
  const { t } = useLang()

  if (!agent) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h3 className="font-display font-semibold text-lg text-stone-800">{t('contact_agent')}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Agent info */}
          <div className="flex items-center gap-3">
            {agent.avatar_url ? (
              <img src={agent.avatar_url} alt={agent.full_name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-bold text-lg">
                {agent.full_name?.[0] ?? 'A'}
              </div>
            )}
            <div>
              <p className="font-semibold text-stone-800">{agent.full_name}</p>
              {agent.agency_name && (
                <p className="text-sm text-stone-500">{agent.agency_name}</p>
              )}
            </div>
          </div>

          {/* Listing title */}
          <p className="text-sm text-stone-500 italic line-clamp-2">"{title}"</p>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5">
            <a
              href={whatsappUrl(agent.whatsapp || agent.phone, title)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <MessageCircle size={18} /> {t('whatsapp')}
            </a>
            <a
              href={`tel:+251${agent.phone}`}
              className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 rounded-xl transition-colors"
            >
              <Phone size={18} /> {t('call_agent')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
