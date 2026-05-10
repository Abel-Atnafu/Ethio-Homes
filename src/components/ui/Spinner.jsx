export default function Spinner({ size = 'md', fullscreen = false, light = false }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  const color = light ? 'text-white' : 'text-terracotta'

  const spinner = (
    <svg
      className={`animate-spin ${sizes[size]} ${color}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <span className="text-sm text-stone-500 font-medium">Loading…</span>
        </div>
      </div>
    )
  }

  return spinner
}
