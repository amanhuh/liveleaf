import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentView from "@/components/document-view";

export default async function Page({
  params
}: {
  params: { documentId: string }
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <DocumentView />
    </SidebarProvider>
  )
}