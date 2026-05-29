"use client"

import Tiptap from "@/components/editor"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Document as Doc } from "@/types/document.types";

export default function Home() {

  const now = new Date(); 
  const [selectedDocId, setSelectedDocId] = useState("1");
  const Docs: Doc[] = [
    {
      id: "1",
      title: "1st document",
      content: "<p>Hello</p>",
      createdAt: now,
      updatedAt: now,
      parentId: null
    },
    {
      id: "2",
      title: "2nd document",
      content: "<p>Hello</p>",
      createdAt: now,
      updatedAt: now,
      parentId: null
    },
    {
      id: "3",
      title: "3rd document",
      content: "<p>Hello</p>",
      createdAt: now,
      updatedAt: now,
      parentId: "1"
    }
  ];

  const selectedDoc =
  Docs.find(doc => doc.id === selectedDocId)!;

  return (
    <SidebarProvider>
      <AppSidebar documents={Docs} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">ui</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>button.tsx</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-4">
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Tiptap />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}