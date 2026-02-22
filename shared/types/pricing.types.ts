export interface Plan {
  name: string;
  subtitle: string;
  features: string[];
  cta: string;
  ctaVariant: "outline" | "primary";
  recommended: boolean;
}
