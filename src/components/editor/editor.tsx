"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Code,
  Highlighter,
  Strikethrough,
} from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { useMemo, useState, useEffect } from "react";
import type { Document } from "@/types/document.types";
import debounce from "lodash/debounce";
import { SlashCommand } from "@/components/editor/extensions/slash-command";
import { cn } from "@/lib/utils";

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
    onUpdate: ({ editor }) => {
      debouncedSave(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[60vh] focus:outline-none prose prose-neutral dark:prose-invert max-w-none",
      },
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
          <div className="bubble-menu animate-in fade-in-0 zoom-in-95 flex items-center gap-0.5 rounded-xl border border-border/40 bg-background/80 backdrop-blur-xl p-1 shadow-xl shadow-black/[0.08] dark:shadow-black/30">
            {/* Text formatting */}
            <BubbleButton
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              icon={<Bold className="h-3.5 w-3.5" />}
            />
            <BubbleButton
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              icon={<Italic className="h-3.5 w-3.5" />}
            />
            <BubbleButton
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              icon={<UnderlineIcon className="h-3.5 w-3.5" />}
            />
            <BubbleButton
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              icon={<Strikethrough className="h-3.5 w-3.5" />}
            />

            {/* Divider */}
            <div className="mx-0.5 h-4 w-px bg-border/60" />

            {/* Code & Highlight */}
            <BubbleButton
              active={editor.isActive("code")}
              onClick={() => editor.chain().focus().toggleCode().run()}
              icon={<Code className="h-3.5 w-3.5" />}
            />
            <BubbleButton
              active={editor.isActive("highlight")}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              icon={<Highlighter className="h-3.5 w-3.5" />}
            />
          </div>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </>
  );
}

function BubbleButton({
  active,
  onClick,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150 cursor-pointer",
        "hover:bg-accent/80 active:scale-90",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
    </button>
  );
}
