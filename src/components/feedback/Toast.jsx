import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const styles = {
  success: {
    border: 'border-l-4 border-green-500',
    icon: <CheckCircle size={16} className="text-green-500 shrink-0" />,
  },
  error: {
    border: 'border-l-4 border-red-500',
    icon: <AlertCircle size={16} className="text-red-500 shrink-0" />,
  },
  info: {
    border: 'border-l-4 border-terracotta',
    icon: <Info size={16} className="text-terracotta shrink-0" />,
  },
}

export default function Toast({ id, type, message, duration, onDismiss }) {
  const [progress, setProgress] = useState(100)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const interval = setInterval(() => {
      setProgress((p) => Math.max(0, p - (100 / (duration / 100))))
    }, 100)
    return () => clearInterval(interval)
  }, [duration])

  const { border, icon } = styles[type] || styles.info

  return (
    <div
      className={`
        relative overflow-hidden bg-white rounded-2xl shadow-xl
        flex items-start gap-3 px-4 py-3.5 min-w-[280px] max-w-sm
        ${border}
        transition-all duration-300 ease-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      {icon}
      <p className="text-sm text-stone-700 font-medium flex-1 leading-snug pt-0.5">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="text-stone-300 hover:text-stone-500 transition-colors shrink-0"
      >
        <X size={14} />
      </button>
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-stone-100 transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
