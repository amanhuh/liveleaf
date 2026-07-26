import { requireUser } from "@/lib/auth/helper";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentView from "@/components/document-view";

export default async function Page() {
  const session = await requireUser({ redirectTo: "/sign-in" });

  return (
    <SidebarProvider>
      <AppSidebar />
      <DocumentView />
    </SidebarProvider>
  )
}