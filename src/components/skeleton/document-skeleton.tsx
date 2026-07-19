import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function DocumentSkeleton() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Skeleton className="h-4 w-32" />
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-16">
          <Skeleton className="h-10 w-64 mb-6" />

        </div>
      </div>
    </SidebarInset>
  );
}
