import { Card, CardContent } from "@/shared/components/ui/card";

export function InfoCards() {
  return (
    <section className="flex items-center justify-center bg-[#F7F9FA] p-30">
      <div className="flex max-w-4xl flex-col items-center gap-12">
        {/* Heading */}
        <div className="space-y-4">
          <h2 className="max-w-2xl px-24 text-center text-5xl leading-14 font-bold tracking-[-1.2px] text-gray-800 md:text-4xl">
            Meta dice 10 compras. Stripe confirma 5.
          </h2>

          {/* Subheading */}
          <p className="max-w-2xl text-center text-lg text-slate-500">
            Esa discrepancia destruye el ROAS, rompe la atribución y hace que las decisiones sean
            incorrectas.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {[
            "Campañas optimizadas con datos falsos que queman tu presupuesto.",
            "Revenue reportado ≠ revenue real en el banco. Imposible escalar así.",
            "Pérdida de confianza total entre marketing teams y founders.",
          ].map((text, index) => (
            <Card
              key={index}
              className="rounded-2xl border border-[#E3E8EE] bg-white p-0 shadow-sm"
            >
              <CardContent className="space-y-4 p-8">
                {/* Icon */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEF2F2]">
                  <p className="text-base font-bold text-red-500">!</p>
                </div>

                {/* Text */}
                <p className="text-base/6 leading-relaxed font-medium text-gray-800">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
