"use client"

import { Skeleton } from "@/shared/components/ui/skeleton"


export function TrackingDetailSkeleton() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back */}
        <Skeleton className="h-4 w-48" />

        {/* Header Section */}
        <div className="space-y-6 mt-6">

          {/* Badges */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Title + date */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-4 w-56" />
          </div>

          {/* Attribution Diagnosis */}
          <div className="space-y-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-6 w-96" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Diagnóstico Técnico */}
        <div className="rounded-2xl bg-slate-900 p-6 space-y-4">
          <Skeleton className="h-4 w-40 bg-slate-700" />
          <Skeleton className="h-4 w-full bg-slate-700" />
          <Skeleton className="h-4 w-5/6 bg-slate-700" />
          <Skeleton className="h-16 w-full rounded-lg bg-black/40" />
        </div>

        {/* Impacto */}
        <div className="border rounded-2xl p-6 space-y-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-3 w-48" />
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Acción recomendada */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
          <Skeleton className="h-4 w-40 bg-emerald-200" />
          <Skeleton className="h-4 w-full bg-emerald-200" />
          <Skeleton className="h-4 w-5/6 bg-emerald-200" />
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

      </div>
    </div>
  )
}