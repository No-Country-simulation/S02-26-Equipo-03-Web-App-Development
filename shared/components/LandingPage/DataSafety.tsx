import { CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";

const safetyPoints = [
  "Stripe secure connection via OAuth 2.0",
  "GDPR & privacy-first data handling",
  "Meta Conversion API official support",
  "Audit-ready event logs for transparency",
  "Role-based access controls (RBAC)",
];

const trustBadges = ["GDPR COMPLIANT", "ISO 27001 READY", "STRIPE PARTNER", "META VERIFIED"];

export default function DataSafety() {
  return (
    <section className="bg-white px-5 py-16 md:px-8 md:py-24">
      <Card className="mx-auto w-full max-w-6xl rounded-3xl border-primary/10 bg-[#1A1F36] text-primary-foreground shadow-none">
        <CardContent className="grid gap-12 px-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-14 md:py-16">
          <div>
            <h2 className="max-w-md text-4xl leading-tight font-semibold tracking-tight text-primary-foreground">
              Diseñado para operar con datos sensibles de revenue
            </h2>

            <ul className="mt-8 space-y-4">
              {safetyPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm text-primary-foreground/85"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#0066FF]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-md text-sm italic text-primary-foreground/65">
              “Tu equipo ve datos reales sin comprometer la seguridad ni la privacidad.”
            </p>
          </div>

          <div className="grid grid-cols-2 place-items-center gap-6 md:gap-8">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="flex size-32 items-center justify-center rounded-full border border-primary-foreground/15 text-center"
              >
                <span className="max-w-20 text-[10px] font-semibold tracking-[0.16em] text-primary-foreground/70">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
