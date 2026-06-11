import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentView from "@/components/document-view";

export default async function Page({
  params
}: PageProps<'/d/[documentId]'>) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <DocumentView />
    </SidebarProvider>
  )
}