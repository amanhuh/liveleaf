import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarSkeleton, SidebarFooterSkeleton } from "@/components/skeleton/sidebar-skeleton";
import { DocumentSkeleton } from "@/components/skeleton/document-skeleton";

export default function Loading() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarSkeleton />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooterSkeleton />
        <SidebarRail />
      </Sidebar>
      <DocumentSkeleton />
    </SidebarProvider>
  );
}
