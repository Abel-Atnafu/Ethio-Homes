export default function StepReview({ form, files, t }) {
  const rows = [
    { label: 'Title', value: form.title },
    {
      label: 'Price',
      value: `ETB ${Number(form.price).toLocaleString()}${form.price_type === 'rent' ? ` /${form.price_period === 'monthly' ? 'mo' : 'yr'}` : ''}`,
      valueClass: 'text-gold font-bold',
    },
    {
      label: 'Type',
      value: `${form.price_type === 'rent' ? t('for_rent') : t('for_sale')} · ${t(`type_${form.property_type}`)}`,
    },
    {
      label: 'Location',
      value: [form.woreda, form.subcity, form.city].filter(Boolean).join(', '),
    },
    (form.bedrooms || form.bathrooms || form.area_sqm) && {
      label: 'Size',
      value: [
        form.bedrooms && `${form.bedrooms} bed`,
        form.bathrooms && `${form.bathrooms} bath`,
        form.area_sqm && `${form.area_sqm} sqm`,
      ].filter(Boolean).join(' · '),
    },
    { label: 'Photos', value: `${files.length} photo${files.length !== 1 ? 's' : ''}` },
    form.amenities.length > 0 && {
      label: 'Amenities',
      value: form.amenities.map((a) => t(`amenity_${a}`)).join(', '),
    },
  ].filter(Boolean)

  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-500 mb-4">Please review your listing before submitting.</p>
      <div className="bg-stone-50 rounded-xl divide-y divide-stone-100">
        {rows.map(({ label, value, valueClass }) => (
          <div key={label} className="flex justify-between items-start px-4 py-3 gap-4">
            <span className="text-stone-500 text-sm shrink-0">{label}</span>
            <span className={`text-sm font-medium text-stone-800 text-right ${valueClass || ''}`}>
              {value || <span className="text-stone-300 italic">—</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
