import { cn } from "@/shared/lib/utils";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
};

// Section
export function Section({ children, className }: BaseProps) {
  return (
    <section
      className={cn("w-full bg-slate-50 px-12 py-8 md:px-16 md:py-12 lg:px-20 lg:py-16", className)}
    >
      {children}
    </section>
  );
}

// SectionContent
export function SectionContent({ children, className }: BaseProps) {
  return <div className={cn("mx-auto max-w-7xl", className)}>{children}</div>;
}

//Section Header
export function SectionHeader({ children, className }: BaseProps) {
  return <div className={cn("space-y-4 text-center", className)}>{children}</div>;
}

// SectionHeaderTitle
export function SectionTitle({ children, className }: BaseProps) {
  return <h2 className={cn("text-[32px]/11 font-bold text-slate-950", className)}>{children}</h2>;
}

// SectionHeaderDescription
export function SectionDescription({ children, className }: BaseProps) {
  return <p className={cn("text-xl/7 font-semibold text-slate-600", className)}>{children}</p>;
}
