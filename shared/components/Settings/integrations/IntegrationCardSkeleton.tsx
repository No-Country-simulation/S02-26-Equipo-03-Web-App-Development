import { Skeleton } from "@/shared/components/ui/skeleton";

export default function IntegrationCardSkeleton() {
  return (
    <div className="flex w-60 flex-col rounded-lg border border-[#E2E8F0]/50 bg-white p-6">
      <div className="flex flex-col gap-4 py-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="mt-auto flex flex-col gap-3 border-t border-[#F1F5F9] pt-3">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
