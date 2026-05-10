import Spinner from './Spinner'

const variants = {
  primary: 'bg-terracotta hover:bg-orange-800 text-white shadow-lg shadow-terracotta/25 hover:shadow-terracotta/40',
  secondary: 'bg-white border border-stone-200 hover:border-terracotta text-stone-700 hover:text-terracotta shadow-sm',
  ghost: 'text-stone-600 hover:text-terracotta hover:bg-stone-100',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
  gold: 'bg-gold hover:bg-amber-600 text-white shadow-lg shadow-gold/25',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-sm rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && <Spinner size="sm" light={variant === 'primary' || variant === 'danger' || variant === 'gold'} />}
      {children}
    </button>
  )
}
