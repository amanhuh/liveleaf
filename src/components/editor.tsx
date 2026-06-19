"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { useDocumentStore } from "@/stores/document-store";
import { useMemo } from "react";
import type { Document } from "@/types/document.types";
import debounce from "lodash/debounce";

type TiptapProps = {
  document: Document;
  content: string;
  onChange: (content: string) => void;
};

export default function Tiptap({ document, content, onChange }: TiptapProps) {
  const updateDocument = useDocumentStore((state) => state.updateDocument);

  const debouncedSave = useMemo(
    () =>
      debounce((content: string) => {
        updateDocument(document.id, { content });
      }, 500),
    [document.id, updateDocument],
  );

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:float-left before:text-muted-foreground before:h-0 before:pointer-events-none opacity-60",
      }),
      Typography,
      Underline,
      Highlight,
    ],

    content,

    editorProps: {
      attributes: {
        class:
          "min-h-screen focus:outline-none prose prose-neutral dark:prose-invert max-w-none",
      },
    },

    onUpdate: ({ editor }) => {
      debouncedSave(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
}
