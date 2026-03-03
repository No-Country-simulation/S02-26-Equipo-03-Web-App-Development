import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/shared/components/LandingPage";

export function TrackingHealthSection() {
  return (
    <Section className="bg-emerald-600">
      <SectionContent className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-12">
        <SectionHeader className="flex max-w-140 flex-col space-y-6 text-start">
          <SectionTitle className="text-white">
            Tracking Health: Tu Sistema de Alerta Temprana
          </SectionTitle>
          <SectionDescription className="text-white">
            GardenAds monitorea tu tracking 24/7. En el momento que algo falla, te alertamos — antes
            de que gastes plata.
          </SectionDescription>
          <ul className="space-y-6 text-base/6 font-medium">
            <li>• 3 problemas detectados</li>
            <li>• $4,200 de revenue en riesgo</li>
            <li>• Score: 72/100 (requiere atención)</li>
          </ul>
        </SectionHeader>
        <div className="flex h-81.5 w-167.5 items-center justify-center bg-slate-400 text-black">
          Slot (Elige uno)
        </div>
      </SectionContent>
    </Section>
  );
}
