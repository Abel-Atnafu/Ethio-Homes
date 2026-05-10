import { Upload, X } from 'lucide-react'

export default function StepPhotos({ files, previews, getRootProps, getInputProps, isDragActive, removeFile, t }) {
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-terracotta bg-terracotta/5 scale-[1.01]'
            : files.length >= 8
            ? 'border-stone-200 bg-stone-50 cursor-not-allowed opacity-60'
            : 'border-stone-200 hover:border-terracotta hover:bg-terracotta/5'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={36} className="mx-auto mb-3 text-stone-300" />
        <p className="text-sm font-semibold text-stone-600">{t('drag_drop')}</p>
        <p className="text-xs text-stone-400 mt-1">{t('max_photos')}</p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-stone-400 text-center">
        {files.length}/8 {t('upload_photos')}
      </p>
    </div>
  )
}
