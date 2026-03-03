"use client"

import { Skeleton } from "@/shared/components/ui/skeleton"
import { Card, CardContent } from "@/shared/components/ui/card"

export function OrdersSkeleton() {
  return (
    <div className="p-2 space-y-6">


      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

  
      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-6">


          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-72 rounded-md" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </div>

     
          <div className="grid grid-cols-8 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>

   
          <div className="space-y-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-6 items-center">
                <Skeleton className="h-4 w-20" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          {/* Footer Pagination */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}