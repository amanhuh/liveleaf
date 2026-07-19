import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { requireUser } from "@/lib/auth/helper";
import { findActiveDocuments, createDocument } from "@/features/documents/repository";

export default async function DashboardPage() {
  const session = await requireUser();
  const documents = await findActiveDocuments(session.user.id);

  const cookieStore = await cookies();
  const lastDocId = cookieStore.get("liveleaf_last_doc")?.value;
  const lastDoc = lastDocId ? documents.find((d) => d.id === lastDocId) : null;

  if (lastDoc) {
    redirect(`/d/${lastDoc.id}`);
  }

  if (documents.length > 0) {
    redirect(`/d/${documents[0].id}`);
  }

  const defaultPage = await createDocument(session.user.id, { title: "Untitled", parentId: null });
  if (defaultPage) {
    redirect(`/d/${defaultPage.id}`);
  }

  redirect("/sign-in");
}
