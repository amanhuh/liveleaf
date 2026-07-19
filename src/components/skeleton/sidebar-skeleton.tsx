import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-1 p-2">
      <Skeleton className="h-4 w-20 mb-3" />
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-2 py-1.5 animate-pulse"
          style={{
            marginLeft: i % 2 === 1 ? "12px" : "0px",
          }}
        >
          <Skeleton className="size-4 shrink-0 rounded bg-sidebar-accent-foreground/5" />
          <Skeleton
            className="h-3.5 rounded bg-sidebar-accent-foreground/5"
            style={{
              width: `${Math.max(50, 90 - (i % 3) * 15)}%`,
            }}
          />
        </div>
      ))}
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
