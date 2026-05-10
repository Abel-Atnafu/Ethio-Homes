import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, LayoutDashboard, AlertTriangle } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/feedback/useToast'
import { supabase } from '../../lib/supabase'
import PageWrapper from '../../components/layout/PageWrapper'
import StatsRow from './StatsRow'
import ListingsTable from './ListingsTable'
import Button from '../../components/ui/Button'

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <p className="text-stone-700 text-sm font-medium text-center mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onCancel}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  )
}

export default function AgentDashboard() {
  const { t } = useLang()
  const { user } = useAuth()
  const { toast } = useToast()

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

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
    toast.success(current ? t('toast_toggle_inactive') : t('toast_toggle_active'))
  }

  async function executeDelete(id) {
    setConfirmDeleteId(null)
    await supabase.from('properties').delete().eq('id', id)
    setListings((prev) => prev.filter((p) => p.id !== id))
    toast.success(t('toast_property_deleted'))
  }

  const total = listings.length
  const active = listings.filter((l) => l.is_active).length

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta/10 rounded-2xl flex items-center justify-center">
              <LayoutDashboard size={20} className="text-terracotta" />
            </div>
            <h1 className="font-display text-2xl font-bold text-stone-800">{t('dashboard_title')}</h1>
          </div>
          <Link to="/post-property">
            <Button variant="primary" size="md">
              <PlusCircle size={16} /> {t('post_property')}
            </Button>
          </Link>
        </div>

        <StatsRow total={total} active={active} />

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-stone-800">{t('my_listings')}</h2>
            {!loading && listings.length > 0 && (
              <span className="text-xs text-stone-400 font-medium">{listings.length} total</span>
            )}
          </div>

          <ListingsTable
            listings={listings}
            loading={loading}
            onToggle={toggleActive}
            onDelete={(id) => setConfirmDeleteId(id)}
          />
        </div>
      </div>

      {confirmDeleteId && (
        <ConfirmModal
          message={t('confirm_delete')}
          onConfirm={() => executeDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </PageWrapper>
  )
}
