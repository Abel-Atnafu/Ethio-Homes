import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/feedback/useToast'
import { supabase } from '../../lib/supabase'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import StepIndicator from './StepIndicator'
import StepBasic from './steps/StepBasic'
import StepLocation from './steps/StepLocation'
import StepDetails from './steps/StepDetails'
import StepPhotos from './steps/StepPhotos'
import StepReview from './steps/StepReview'

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
  const { toast } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)

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
    setPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))])
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

  function validateStep() {
    if (step === 0) {
      if (!form.title.trim()) { toast.error('Please enter a listing title.'); return false }
      if (!form.price) { toast.error('Please enter a price.'); return false }
    }
    return true
  }

  async function uploadImages() {
    const urls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('property-images').upload(path, file)
      if (upErr) throw new Error(upErr.message)
      const { data } = supabase.storage.from('property-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const imageUrls = files.length > 0 ? await uploadImages() : []

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

      toast.success(t('toast_property_posted'))
      navigate('/dashboard')
    } catch (e) {
      toast.error(t('post_error') + ': ' + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const stepProps = { form, set, t }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-stone-800 mb-1">{t('post_title')}</h1>
          <p className="text-stone-500 text-sm">Fill in the details about your property listing.</p>
        </div>

        <StepIndicator steps={STEPS} currentStep={step} t={t} />

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-semibold text-stone-700 mb-5 text-sm uppercase tracking-wide">
            {t(STEPS[step])}
          </h2>

          {step === 0 && <StepBasic {...stepProps} />}
          {step === 1 && <StepLocation {...stepProps} />}
          {step === 2 && <StepDetails {...stepProps} toggleAmenity={toggleAmenity} />}
          {step === 3 && (
            <StepPhotos
              files={files}
              previews={previews}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              removeFile={removeFile}
              t={t}
            />
          )}
          {step === 4 && <StepReview form={form} files={files} t={t} />}

          {/* Navigation */}
          <div className="flex gap-3 mt-7">
            {step > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep((s) => s - 1)}
                disabled={submitting}
              >
                <ChevronLeft size={16} /> {t('back')}
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={() => { if (validateStep()) setStep((s) => s + 1) }}
              >
                {t('next')} <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                fullWidth
                loading={submitting}
                onClick={handleSubmit}
              >
                {t('submit')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
