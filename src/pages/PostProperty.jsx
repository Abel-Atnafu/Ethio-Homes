import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, X, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useLang } from '../App'

const CITIES = ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Hawassa', 'Adama']
const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'commercial', 'land']
const AMENITIES = ['parking', 'generator', 'guard', 'water_tank', 'elevator', 'gym', 'pool', 'internet', 'furnished']

const STEPS = ['step_basic', 'step_location', 'step_details', 'step_photos', 'step_review']

const INITIAL = {
  title: '',
  price_type: 'rent',
  price: '',
  price_period: 'monthly',
  property_type: 'apartment',
  city: 'Addis Ababa',
  subcity: '',
  woreda: '',
  bedrooms: '',
  bathrooms: '',
  area_sqm: '',
  amenities: [],
  description: '',
}

export default function PostProperty() {
  const { t } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleAmenity(a) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }))
  }

  const onDrop = useCallback((accepted) => {
    const remaining = 8 - files.length
    const toAdd = accepted.slice(0, remaining)
    setFiles((prev) => [...prev, ...toAdd])
    setPreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => URL.createObjectURL(f)),
    ])
  }, [files.length])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024,
    disabled: files.length >= 8,
  })

  function removeFile(i) {
    URL.revokeObjectURL(previews[i])
    setFiles((prev) => prev.filter((_, idx) => idx !== i))
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function uploadImages() {
    const urls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('property-images')
        .upload(path, file)
      if (upErr) throw new Error(upErr.message)
      const { data } = supabase.storage.from('property-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function handleSubmit() {
    setError('')
    setSubmitting(true)
    try {
      let imageUrls = []
      if (files.length > 0) imageUrls = await uploadImages()

      const { data: agentData } = await supabase
        .from('agents')
        .select('full_name, phone')
        .eq('id', user.id)
        .single()

      const { error: insertErr } = await supabase.from('properties').insert({
        title: form.title,
        price: parseFloat(form.price),
        price_type: form.price_type,
        price_period: form.price_type === 'rent' ? form.price_period : 'total',
        property_type: form.property_type,
        city: form.city,
        subcity: form.subcity || null,
        woreda: form.woreda || null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        area_sqm: form.area_sqm ? parseFloat(form.area_sqm) : null,
        amenities: form.amenities,
        description: form.description || null,
        images: imageUrls,
        agent_id: user.id,
        agent_name: agentData?.full_name || '',
        agent_phone: agentData?.phone || '',
        is_active: true,
        is_featured: false,
      })

      if (insertErr) throw new Error(insertErr.message)
      navigate('/dashboard')
    } catch (e) {
      setError(t('post_error') + ' ' + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 bg-white'
  const labelClass = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="font-display text-2xl font-bold text-stone-800 mb-6">{t('post_title')}</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                i < step
                  ? 'bg-green-500 text-white'
                  : i === step
                  ? 'bg-terracotta text-white'
                  : 'bg-stone-200 text-stone-400'
              }`}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 transition-colors ${i < step ? 'bg-green-500' : 'bg-stone-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-semibold text-stone-800 mb-5">{t(STEPS[step])}</h2>

          {/* Step 0: Basic info */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('listing_title')}</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  className={inputClass}
                  placeholder="Spacious 3BR Apartment in Bole"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>{t('price_type')}</label>
                <div className="flex rounded-xl overflow-hidden border border-stone-200">
                  {['rent', 'sale'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => set('price_type', type)}
                      className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                        form.price_type === type ? 'bg-terracotta text-white' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {type === 'rent' ? t('for_rent') : t('for_sale')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('price')}</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    className={inputClass}
                    placeholder="25000"
                    min="0"
                    required
                  />
                </div>
                {form.price_type === 'rent' && (
                  <div>
                    <label className={labelClass}>{t('price_period')}</label>
                    <select
                      value={form.price_period}
                      onChange={(e) => set('price_period', e.target.value)}
                      className={inputClass}
                    >
                      <option value="monthly">{t('monthly')}</option>
                      <option value="yearly">{t('yearly')}</option>
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>{t('filter_property_type')}</label>
                <select value={form.property_type} onChange={(e) => set('property_type', e.target.value)} className={inputClass}>
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt} value={pt}>{t(`type_${pt}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t('description')}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  className={inputClass + ' min-h-[100px] resize-none'}
                  placeholder="Describe the property..."
                />
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('city')}</label>
                <select value={form.city} onChange={(e) => set('city', e.target.value)} className={inputClass}>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t('subcity')}</label>
                <input
                  type="text"
                  value={form.subcity}
                  onChange={(e) => set('subcity', e.target.value)}
                  className={inputClass}
                  placeholder="Bole"
                />
              </div>
              <div>
                <label className={labelClass}>{t('woreda')}</label>
                <input
                  type="text"
                  value={form.woreda}
                  onChange={(e) => set('woreda', e.target.value)}
                  className={inputClass}
                  placeholder="03"
                />
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>{t('beds')}</label>
                  <input
                    type="number"
                    value={form.bedrooms}
                    onChange={(e) => set('bedrooms', e.target.value)}
                    className={inputClass}
                    min="0"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('baths')}</label>
                  <input
                    type="number"
                    value={form.bathrooms}
                    onChange={(e) => set('bathrooms', e.target.value)}
                    className={inputClass}
                    min="0"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('area_sqm')}</label>
                  <input
                    type="number"
                    value={form.area_sqm}
                    onChange={(e) => set('area_sqm', e.target.value)}
                    className={inputClass}
                    min="0"
                    placeholder="120"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('select_amenities')}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AMENITIES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                        form.amenities.includes(a)
                          ? 'bg-terracotta text-white border-terracotta'
                          : 'border-stone-200 text-stone-600 hover:border-terracotta hover:text-terracotta'
                      }`}
                    >
                      {t(`amenity_${a}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-terracotta bg-terracotta/5'
                    : files.length >= 8
                    ? 'border-stone-200 bg-stone-50 cursor-not-allowed'
                    : 'border-stone-200 hover:border-terracotta hover:bg-terracotta/5'
                }`}
              >
                <input {...getInputProps()} />
                <Upload size={32} className="mx-auto mb-3 text-stone-400" />
                <p className="text-sm font-medium text-stone-600">{t('drag_drop')}</p>
                <p className="text-xs text-stone-400 mt-1">{t('max_photos')}</p>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-stone-400">{files.length}/8 {t('upload_photos')}</p>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-stone-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Title</span>
                  <span className="font-medium text-stone-800 text-right max-w-[60%]">{form.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Price</span>
                  <span className="font-medium text-gold">ETB {Number(form.price).toLocaleString()} {form.price_type === 'rent' ? `/${form.price_period === 'monthly' ? 'mo' : 'yr'}` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Type</span>
                  <span className="font-medium text-stone-800">{form.price_type === 'rent' ? t('for_rent') : t('for_sale')} · {t(`type_${form.property_type}`)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Location</span>
                  <span className="font-medium text-stone-800">{[form.woreda, form.subcity, form.city].filter(Boolean).join(', ')}</span>
                </div>
                {(form.bedrooms || form.bathrooms) && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Size</span>
                    <span className="font-medium text-stone-800">
                      {form.bedrooms ? `${form.bedrooms} bed` : ''}{form.bathrooms ? ` · ${form.bathrooms} bath` : ''}{form.area_sqm ? ` · ${form.area_sqm}sqm` : ''}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Photos</span>
                  <span className="font-medium text-stone-800">{files.length} photos</span>
                </div>
                {form.amenities.length > 0 && (
                  <div className="flex justify-between items-start">
                    <span className="text-stone-500">Amenities</span>
                    <span className="font-medium text-stone-800 text-right max-w-[60%]">{form.amenities.join(', ')}</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1 px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <ChevronLeft size={16} /> {t('back')}
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 0 && !form.title) return
                  if (step === 0 && !form.price) return
                  setStep((s) => s + 1)
                }}
                className="flex-1 flex items-center justify-center gap-1 bg-terracotta hover:bg-orange-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t('next')} <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-terracotta hover:bg-orange-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {submitting ? t('submitting') : t('submit')}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
