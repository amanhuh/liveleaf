import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentView from "@/components/DocumentView";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <DocumentView />
    </SidebarProvider>
  );
}