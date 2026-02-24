"use client"

import { Skeleton } from "@/shared/components/ui/skeleton"
import { Card, CardContent } from "@/shared/components/ui/card"

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">

      {/* Back */}
      <Skeleton className="h-4 w-40" />

      {/* Status + Order ID */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* Payment Detail Card */}
          <Card className="rounded-2xl">
            <CardContent className="p-8 space-y-6">

              {/* Title */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-36 mx-auto" />
                <Skeleton className="h-10 w-40 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>

              {/* Divider-like spacing */}
              <div className="space-y-4 pt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                  >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* Attribution Card */}
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-4">

              <Skeleton className="h-4 w-28" />

              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>

              <Skeleton className="h-4 w-48" />

            </CardContent>
          </Card>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      
      {/* Title */}
      <Skeleton className="h-3 w-32 mb-6" />

      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            
            {/* Dot + Line */}
            <div className="mt-1 flex flex-col items-center">
              <Skeleton className="h-3 w-3 rounded-full" />
              {i < 3 && (
                <Skeleton className="mt-2 h-8 w-px" />
              )}
            </div>

            {/* Content */}
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-56" />
            </div>

          </div>
        ))}
      </div>
    </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Verified Card */}
          <Card className="rounded-2xl">
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </CardContent>
          </Card>

          {/* Disabled Copy Button */}
          <Skeleton className="h-11 w-full rounded-md" />

          {/* Stripe Button */}
          <Skeleton className="h-11 w-full rounded-md" />

        </div>

      </div>
      
    </div>
  )
}