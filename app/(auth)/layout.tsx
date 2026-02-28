import { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { GardenAdsLogo } from "@/shared/components/Logo/Logo";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { redirect } from "next/navigation";
type AuthLayoutProps = {
  children: ReactNode;
};

const socialProofItems = ["100% Stripe validated", "Sin duplicados", "Sin eventos perdidos"];

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await getCurrentUser().catch(() => null);

  if (session) {
    redirect("/dashboard");
  }
  return (
    <main className="min-h-dvh w-full bg-white">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
        <section className="hidden bg-gradient-to-b from-emerald-950 via-emerald-800 to-emerald-600 px-16 py-14 text-white lg:flex lg:flex-col lg:justify-center">
          <div className="mx-auto w-full max-w-xl space-y-8">
            <GardenAdsLogo variant="white" />

            <article className="rounded-2xl bg-white px-8 py-10 text-center text-black">
              <div className="flex">
                <FaQuoteLeft size={24} className="mb-auto inline text-black" />
                <p className="text-lg">
                  Desde que implementamos GardenAds, tenemos control total sobre la integridad del
                  tracking. Sabemos exactamente cuándo algo se rompe y por qué.
                </p>
                <FaQuoteRight size={24} className="mt-auto inline text-black" />
              </div>
              <div className="mt-6">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-base font-semibold text-white">
                  JM
                </div>
                <p className="font-semibold">Julián Méndez</p>
                <p className="text-muted-foreground text-sm">CTO · Finmark Digital</p>
              </div>
            </article>

            <ul className="space-y-4 rounded-2xl bg-white px-8 py-6 text-black">
              {socialProofItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-2xl">
                  <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                  <span className="text-2xl font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="border-border bg-card w-full max-w-[560px] rounded-2xl border p-6 shadow-sm sm:p-10">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
