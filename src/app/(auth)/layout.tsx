export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — TKD Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-navy-950">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-black" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          {/* Logo circle */}
          <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-tkd-red-500 to-tkd-red-700 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">TKD</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white tracking-tight text-center">
            Федерация Таэквондо
          </h1>
          <h2 className="text-2xl font-semibold text-navy-300 mt-2 text-center">
            Узбекистана
          </h2>

          <div className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-tkd-red-500 to-transparent" />

          <p className="mt-8 text-lg text-navy-300 text-center max-w-md leading-relaxed">
            Глобальная система управления
          </p>
          <p className="text-sm text-navy-400 mt-2">
            Global Management System
          </p>

          {/* Stats row */}
          <div className="mt-16 flex gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">14</div>
              <div className="text-xs text-navy-400 mt-1">Областей</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-xs text-navy-400 mt-1">Спортсменов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-xs text-navy-400 mt-1">Клубов</div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-navy-600 via-tkd-red-500 to-navy-600" />
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-tkd-red-500 to-tkd-red-700 flex items-center justify-center">
              <span className="text-white text-lg font-bold">TKD</span>
            </div>
            <div className="ml-3">
              <div className="font-bold text-foreground">TKD-UZ GMS</div>
              <div className="text-xs text-muted-foreground">Федерация Таэквондо</div>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
