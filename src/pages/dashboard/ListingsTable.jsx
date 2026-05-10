import { Link } from 'react-router-dom'
import { PlusCircle, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'

function formatPrice(price) {
  return `ETB ${new Intl.NumberFormat('en-ET').format(price)}`
}

export default function ListingsTable({ listings, onToggle, onDelete, loading }) {
  const { t } = useLang()

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="inline-block w-8 h-8 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-stone-400 mb-4 text-sm">{t('no_listings_yet')}</p>
        <Link
          to="/post-property"
          className="inline-flex items-center gap-2 bg-terracotta text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-800 transition-colors"
        >
          <PlusCircle size={16} /> {t('post_property')}
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-5 py-3">Property</th>
            <th className="text-left px-5 py-3">Price</th>
            <th className="text-left px-5 py-3">City</th>
            <th className="text-left px-5 py-3">Type</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-right px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50">
          {listings.map((p) => (
            <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-stone-200 shrink-0" />
                  )}
                  <Link
                    to={`/property/${p.id}`}
                    className="font-medium text-stone-800 hover:text-terracotta line-clamp-1 transition-colors"
                  >
                    {p.title}
                  </Link>
                </div>
              </td>
              <td className="px-5 py-4 text-gold font-semibold whitespace-nowrap">{formatPrice(p.price)}</td>
              <td className="px-5 py-4 text-stone-600">{p.city}</td>
              <td className="px-5 py-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  p.price_type === 'rent'
                    ? 'bg-terracotta/10 text-terracotta'
                    : 'bg-stone-100 text-stone-600'
                }`}>
                  {p.price_type === 'rent' ? t('for_rent') : t('for_sale')}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  p.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  {p.is_active ? t('status_active') : t('status_inactive')}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onToggle(p.id, p.is_active)}
                    title={p.is_active ? t('deactivate') : t('activate')}
                    className="p-2 rounded-lg text-stone-400 hover:text-terracotta hover:bg-terracotta/10 transition-colors"
                  >
                    {p.is_active
                      ? <ToggleRight size={18} className="text-green-500" />
                      : <ToggleLeft size={18} />
                    }
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    title={t('delete')}
                    className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
