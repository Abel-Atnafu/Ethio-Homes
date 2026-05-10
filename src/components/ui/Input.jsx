export default function Input({
  label,
  icon: Icon,
  error,
  hint,
  rightElement,
  className = '',
  darkMode = false,
  ...props
}) {
  const base = darkMode
    ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-gold focus:bg-white/15'
    : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-terracotta focus:bg-white'

  const errorClass = error
    ? 'border-red-400 focus:border-red-400'
    : ''

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || hint) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-white/70' : 'text-stone-500'}`}>
              {label}
            </label>
          )}
          {hint && (
            <span className={`text-xs ${darkMode ? 'text-white/40' : 'text-stone-400'}`}>{hint}</span>
          )}
        </div>
      )}
      <div className="relative">
        {Icon && (
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-white/40' : 'text-stone-400'}`}>
            <Icon size={15} />
          </span>
        )}
        <input
          {...props}
          className={`
            w-full border rounded-xl py-3.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-terracotta/20
            transition-all duration-150
            ${Icon ? 'pl-10' : 'pl-4'}
            ${rightElement ? 'pr-12' : 'pr-4'}
            ${base}
            ${errorClass}
          `}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}
