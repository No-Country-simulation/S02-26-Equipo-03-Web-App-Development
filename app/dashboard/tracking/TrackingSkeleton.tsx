"use client"

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function TrackingSkeleton() {
  return (
    <div className="space-y-6">

   
      <Card className="border-none text-white">
        <CardContent className="p-8 flex justify-between items-center">
          <div className="space-y-4 w-2/3">
            <Skeleton className="h-5 w-32 " />
            <Skeleton className="h-10 w-96 " />
            <Skeleton className="h-4 w-80 " />
          </div>

          <div className="flex items-center gap-6">
           
            <Skeleton className="h-30 w-30 rounded-full " />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ========================= */}
      {/* Problems Table */}
      {/* ========================= */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <div />
          </div>

          {/* Table Rows */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}