import CardsSections from "@/shared/components/LandingPage/CardsSections";
import DataSafety from "@/shared/components/LandingPage/DataSafety";
import SocialProof from "@/shared/components/LandingPage/SocialProof";
import Faqs from "@/shared/components/LandingPage/Faqs";

export default function Home() {
  return (
    <main className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>
        <CardsSections
          title="La capa de verdad entre Ads y pagos reales"
          cards={[
            {
              title: "Revenue confirmado por Stripe",
              icon: {
                name: "database",
                size: 32,
                className: "text-blue-500 bg-blue-100 rounded-full p-1",
              },
              description:
                "Cruzamos cada evento de compra con el pago real confirmado en tu pasarela de pago.",
            },
            {
              title: "Atributtion journey por orden",
              icon: {
                name: "layers",
                size: 32,
                className: "text-blue-500 bg-blue-100 rounded-full p-1",
              },
              description:
                "Vemos el camino completo de cada cliente, desde el primer clic hasta el pago final.",
            },
            {
              title: "Tracking Healt automático",
              icon: {
                name: "activity",
                size: 32,
                className: "text-blue-500 bg-blue-100 rounded-full p-1",
              },
              description:
                "Diagnóstico en tiempo real que te alerta cuando tu tranking se rompe por un update",
            },
          ]}
        />
        <CardsSections
          title="Todo lo que necesitas para escalar con datos"
          cards={[
            {
              title: "Traking Healt Score",
              icon: {
                name: "activity",
                size: 32,
                className: "text-blue-500 bg-blue-100 rounded-full p-1",
              },
              description: "Un puntaje de 0-100 sobre la calidad de tus datos en tiempo real.",
            },
            {
              title: "Order Journey Timeline",
              icon: {
                name: "layers",
                size: 32,
                className: "text-blue-500 bg-blue-100 rounded-full p-1",
              },
              description:
                "Mirá cada interacción que llevó a una nueva venta confirmada por Stripe.",
            },
            {
              title: "Campaign Thuth Layer",
              icon: {
                name: "globe",
                size: 32,
                className: "text-blue-500 bg-blue-100 rounded-full p-1",
              },
              description: "Inyectamos revenue real en tu vista de campañas para Meta Y Google.",
            },
            {
              title: "Stripe Source of Truth",
              icon: {
                name: "database",
                size: 32,
                className: "text-blue-500 bg-blue-100 rounded-full p-1",
              },
              description: "El dinero en el banco es la única métrica que importa para optimizar.",
            },
            {
              title: "Meta + Google Integration",
              icon: {
                name: "send",
                size: 32,
                className: "text-blue-500 bg-blue-100 rounded-full p-1",
              },
              description: "Sincronización bidireccional de eventos y conversiones offline.",
            },
            {
              title: "Export & Reporting",
              icon: {
                name: "barChart",
                size: 32,
                className: "text-blue-500 bg-blue-100 rounded-full p-1",
              },
              description: "Generá reportes automáticos en PDF a CSV listos para presentar.",
            },
          ]}
        />
        <DataSafety />
        {/* Plans section */}
        <SocialProof />
        <Faqs />
      </div>
    </main>
  );
}
