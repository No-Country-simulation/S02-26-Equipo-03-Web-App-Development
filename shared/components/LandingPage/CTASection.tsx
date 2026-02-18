
export function CTASection() {
  return (
    <section className="px-4 py-32 bg-white">
      <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-gradient-cta px-8 py-20 text-center shadow-2xl shadow-blue-200">
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5 tracking-tight">
          Dejá de operar con
          <br />
          números estimados.
        </h2>
        <p className="text-white/80 text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          En 15 minutos te mostramos en vivo dónde se pierde tu atribución y
          cómo recuperarla.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button className="bg-white text-primary-blue font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors duration-150 active:scale-[0.98] shadow-sm min-w-[160px] cursor-pointer">
            Agendar demo
          </button>
          <button className="bg-white/10 border border-white/30 text-white font-semibold text-sm px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors duration-150 active:scale-[0.98] min-w-[160px] cursor-pointer">
            Iniciar sesión
          </button>
        </div>
      </div>
    </section>
  );
}

