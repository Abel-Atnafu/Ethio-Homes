export default function AuthBgShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-terracotta/30 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-orange-900/40 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      />
    </div>
  )
}
