import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Edit2, Trash2, ToggleLeft, ToggleRight, LayoutDashboard } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useLang } from '../App'

function formatPrice(price) {
  return `ETB ${new Intl.NumberFormat('en-ET').format(price)}`
}

export default function AgentDashboard() {
  const { t } = useLang()
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadListings() {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })
    setListings(data || [])
    setLoading(false)
  }

  useEffect(() => { loadListings() }, [user])

  async function toggleActive(id, current) {
    await supabase.from('properties').update({ is_active: !current }).eq('id', id)
    setListings((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p))
  }

  async function deleteListing(id) {
    if (!window.confirm(t('delete_confirm'))) return
    await supabase.from('properties').delete().eq('id', id)
    setListings((prev) => prev.filter((p) => p.id !== id))
  }

  const total = listings.length
  const active = listings.filter((l) => l.is_active).length

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={24} className="text-terracotta" />
            <h1 className="font-display text-2xl font-bold text-stone-800">{t('dashboard_title')}</h1>
          </div>
          <Link
            to="/post-property"
            className="flex items-center gap-2 bg-terracotta hover:bg-orange-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <PlusCircle size={16} /> {t('post_property')}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <p className="text-sm text-stone-500 mb-1">{t('total_listings')}</p>
            <p className="text-3xl font-bold text-stone-800">{total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <p className="text-sm text-stone-500 mb-1">{t('active_listings')}</p>
            <p className="text-3xl font-bold text-terracotta">{active}</p>
          </div>
        </div>

        {/* Listings table */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-800">{t('my_listings')}</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-stone-400 animate-pulse">{t('loading')}</div>
          ) : listings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-stone-400 mb-4">{t('no_listings_yet')}</p>
              <Link
                to="/post-property"
                className="inline-flex items-center gap-2 bg-terracotta text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-800 transition-colors"
              >
                <PlusCircle size={16} /> {t('post_property')}
              </Link>
            </div>
          ) : (
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
                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
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
                      <td className="px-5 py-4 text-gold font-semibold">{formatPrice(p.price)}</td>
                      <td className="px-5 py-4 text-stone-600">{p.city}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          p.price_type === 'rent' ? 'bg-terracotta/10 text-terracotta' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {p.price_type === 'rent' ? t('for_rent') : t('for_sale')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          p.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {p.is_active ? t('status_active') : t('status_inactive')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleActive(p.id, p.is_active)}
                            title={p.is_active ? t('deactivate') : t('activate')}
                            className="p-1.5 text-stone-400 hover:text-terracotta transition-colors"
                          >
                            {p.is_active ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                          </button>
                          <button
                            onClick={() => deleteListing(p.id)}
                            title={t('delete')}
                            className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
