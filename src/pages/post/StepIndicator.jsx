import { CheckCircle } from 'lucide-react'

export default function StepIndicator({ steps, currentStep, t }) {
  return (
    <div className="flex items-center gap-1 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1 flex-1">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
              i < currentStep
                ? 'bg-green-500 text-white scale-95'
                : i === currentStep
                ? 'bg-terracotta text-white shadow-md shadow-terracotta/30'
                : 'bg-stone-200 text-stone-400'
            }`}
          >
            {i < currentStep ? <CheckCircle size={15} /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
                i < currentStep ? 'bg-green-400' : 'bg-stone-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
