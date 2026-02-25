"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { Info } from "lucide-react";

export type Trend = {
  value: string;
  variant?: "positive" | "negative" | "neutral";
};

export type DetailCardProps = {
  title: string;
  size?: "sm" | "md" | "lg";
  value: string;
  valueColor?: "default" | "success" | "danger" | "warning";
  trend?: Trend;
  className?: string;
};

const sizeVariants = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

const valueColorVariants = {
  default: "text-black",
  success: "text-emerald-600",
  danger: "text-rose-600",
  warning: "text-amber-600",
};

const trendVariants = {
  positive: "text-emerald-600",
  negative: "text-rose-600",
  neutral: "text-muted-foreground",
};

export function DetailCard({
  title,
  size = "lg",
  value,
  valueColor = "default",
  trend,
  className,
}: DetailCardProps) {
  return (
    <Card className={cn("gap-2 border-[#F1F5F9] bg-[#F8FAFC] p-6 shadow-none", className)}>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
          {title}
          <Info className="size-3.5" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-baseline p-0">
        <p className={`${sizeVariants[size]} font-bold ${valueColorVariants[valueColor]}`}>
          {value}
        </p>
        {trend && (
          <span className={`text-[10px] font-bold ${trendVariants[trend.variant ?? "neutral"]}`}>
            {trend.value}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
