"use client"

import { Skeleton } from "@/shared/components/ui/skeleton"
import { Card, CardContent } from "@/shared/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">

      {/* ===================== */}
      {/* Top Metrics */}
      {/* ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===================== */}
      {/* Main Section */}
      {/* ===================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT - Chart Card */}
        <Card className="xl:col-span-2 rounded-2xl">
          <CardContent className="p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-44 rounded-md" />
            </div>

            {/* Chart Area */}
            <div className="h-80 w-full rounded-lg border border-gray-200 p-6">
              <Skeleton className="h-full w-full" />
            </div>

            {/* Legend */}
            <div className="flex gap-6">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>

          </CardContent>
        </Card>

        {/* RIGHT - Issues Panel */}
        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-6">

            {/* Tabs */}
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-full" />
            </div>

            {/* View Problems Button */}
            <Skeleton className="h-10 w-full rounded-md" />

            {/* Issues List */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-3 w-3 rounded-full mt-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>

            {/* Footer Revenue at Risk */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-20" />
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}