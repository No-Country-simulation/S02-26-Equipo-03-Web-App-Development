

const STATS = [
  {
    value: "$2,4M+",
    label: "Revenue Trackeado",
    subLabel: "(confirmado, no reportado)",
  },
  {
    value: "50+",
    label: "E-commerce Confían en Nosotros",
    subLabel: "(equipos facturando +$1M/año)",
  },
  {
    value: "+30%",
    label: "Mejora Promedio en ROAS",
    subLabel: "(después de ver datos reales)",
  },
  {
    value: "99.9%",
    label: "Uptime",
    subLabel: "(el tracking nunca duerme)",
  },
];

export default function StatsSection() {
  return (
    <section className="w-full bg-[#059669] py-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Números Que Hablan Por Nosotros
          </h2>
          <p className="text-emerald-50/80 text-lg">
            Resultados reales de empresas reales usando GardenAds.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {STATS.map((stat, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center px-4 relative ${
                // Añade el divisor vertical solo en pantallas grandes y si no es el último
                index !== STATS.length - 1 ? "lg:border-r lg:border-emerald-400/50" : ""
              }`}
            >
              <span className="text-5xl md:text-6xl font-bold mb-4 tracking-tighter">
                {stat.value}
              </span>
              <h3 className="text-lg font-semibold mb-2">
                {stat.label}
              </h3>
              <p className="text-emerald-100/70 text-sm italic">
                {stat.subLabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}