import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/helper";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentView from "@/components/document-view";

export default async function Page({
  params
}: {
  params: { documentId: string }
}) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return (
    <SidebarProvider>
      <AppSidebar />
      <DocumentView />
    </SidebarProvider>
  )
}