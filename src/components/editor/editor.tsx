"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { Bold, Italic, UnderlineIcon, Code, Highlighter } from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { useMemo, useState, useEffect } from "react";
import type { Document } from "@/types/document.types";
import debounce from "lodash/debounce";
import { SlashCommand } from "@/components/editor/extensions/slash-command"

type TiptapProps = {
  document: Document;
  content: string;
};

export default function Tiptap({ document, content }: TiptapProps) {
  const [, forceUpdate] = useState({});

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
      SlashCommand,
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:float-left before:text-muted-foreground before:h-0 before:pointer-events-none opacity-60",
      }),
      Typography,
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

  useEffect(() => {
    if (!editor) return;

    const update = () => forceUpdate({});

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  return (
    <>
      {editor && (
        <BubbleMenu editor={editor}>
          <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-md">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={
                editor.isActive("bold")
                  ? "bg-accent p-1 rounded"
                  : "p-1 rounded"
              }
            >
              <Bold className="h-4 w-4" />
            </button>

            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={
                editor.isActive("italic")
                  ? "bg-accent p-1 rounded"
                  : "p-1 rounded"
              }
            >
              <Italic className="h-4 w-4" />
            </button>

            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={
                editor.isActive("underline")
                  ? "bg-accent p-1 rounded"
                  : "p-1 rounded"
              }
            >
              <UnderlineIcon className="h-4 w-4" />
            </button>

            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={
                editor.isActive("code")
                  ? "bg-accent p-1 rounded"
                  : "p-1 rounded"
              }
            >
              <Code className="h-4 w-4" />
            </button>

            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={
                editor.isActive("highlight")
                  ? "bg-accent p-1 rounded"
                  : "p-1 rounded"
              }
            >
              <Highlighter className="h-4 w-4" />
            </button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </>
  );
}
