import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentView from "@/components/document-view";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <DocumentView />
    </SidebarProvider>
  );
}