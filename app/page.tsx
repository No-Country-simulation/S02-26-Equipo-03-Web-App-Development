import Image from "next/image";
import CardsSections from "@/shared/components/LandingPage/CardsSections";

export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="bg-foreground text-background flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-colors hover:bg-[#383838] md:w-[158px] dark:hover:bg-[#ccc]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
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
      </div>
    </div>
  );
}
