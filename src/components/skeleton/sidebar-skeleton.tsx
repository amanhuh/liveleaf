import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-2">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-7 w-full rounded-md" />
      <Skeleton className="h-7 w-[90%] rounded-md ml-3" />
      <Skeleton className="h-7 w-[85%] rounded-md ml-3" />
      <Skeleton className="h-7 w-full rounded-md mt-1" />
      <Skeleton className="h-7 w-[80%] rounded-md ml-3" />
    </div>
  );
}

export function SidebarFooterSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-t">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
