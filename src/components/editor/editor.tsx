"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
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
import { useMemo, useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import { SlashCommand } from "@/components/editor/extensions/slash-command";
import { cn } from "@/lib/utils";
import type { TiptapProps } from "@/components/editor/types";
import { isTextSelection } from "@tiptap/core";

export default function Tiptap({ document, content }: TiptapProps) {
  const formattedToRef = useRef<number | null>(null);

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
    // Clear stored marks once the cursor moves past the formatted region.
    // Using editor lifecycle callbacks (not useEffect) avoids React re-render cascades.
    onSelectionUpdate: ({ editor }) => {
      const { selection } = editor.state;
      if (selection.empty && formattedToRef.current !== null) {
        if (selection.from >= formattedToRef.current) {
          const view = editor.view;
          setTimeout(() => {
            if (view && !view.isDestroyed) {
              view.dispatch(view.state.tr.setStoredMarks([]));
            }
          }, 0);
        }
        formattedToRef.current = null;
      }
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[60vh] focus:outline-none prose prose-neutral dark:prose-invert max-w-none",
      },
    },
  });

  // useEditorState subscribes to editor transactions and re-renders ONLY when
  // the selected values change (deep-equal by default), unlike forceUpdate()
  // which re-rendered on every single transaction regardless.
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive("bold") ?? false,
      isItalic: editor?.isActive("italic") ?? false,
      isUnderline: editor?.isActive("underline") ?? false,
      isStrike: editor?.isActive("strike") ?? false,
      isCode: editor?.isActive("code") ?? false,
      isHighlight: editor?.isActive("highlight") ?? false,
    }),
  });

  // Toggle a mark and record the end of the formatted region so we can
  // clear stored marks once the cursor leaves it.
  const toggle = useCallback(
    (command: () => void) => {
      if (!editor) return;
      const { selection } = editor.state;
      if (!selection.empty) {
        formattedToRef.current = selection.to;
      }
      command();
    },
    [editor],
  );

  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor, state }) => {
            const { selection } = state;
            return (
              editor.isEditable &&
              editor.view.hasFocus() &&
              !selection.empty &&
              isTextSelection(selection) &&
              !editor.isActive("codeBlock")
            );
          }}
        >
          <div className="bubble-menu animate-in fade-in-0 zoom-in-95 flex items-center gap-0.5 rounded-xl border border-border/40 bg-background/80 backdrop-blur-xl p-1 shadow-xl shadow-black/[0.08] dark:shadow-black/30">
            {/* Text formatting */}
            <BubbleButton
              active={editorState?.isBold ?? false}
              onClick={() => toggle(() => editor.chain().focus().toggleBold().run())}
              icon={<Bold className="h-3.5 w-3.5" />}
            />
            <BubbleButton
              active={editorState?.isItalic ?? false}
              onClick={() => toggle(() => editor.chain().focus().toggleItalic().run())}
              icon={<Italic className="h-3.5 w-3.5" />}
            />
            <BubbleButton
              active={editorState?.isUnderline ?? false}
              onClick={() => toggle(() => editor.chain().focus().toggleUnderline().run())}
              icon={<UnderlineIcon className="h-3.5 w-3.5" />}
            />
            <BubbleButton
              active={editorState?.isStrike ?? false}
              onClick={() => toggle(() => editor.chain().focus().toggleStrike().run())}
              icon={<Strikethrough className="h-3.5 w-3.5" />}
            />

            {/* Divider */}
            <div className="mx-0.5 h-4 w-px bg-border/60" />

            {/* Code & Highlight */}
            <BubbleButton
              active={editorState?.isCode ?? false}
              onClick={() => toggle(() => editor.chain().focus().toggleCode().run())}
              icon={<Code className="h-3.5 w-3.5" />}
            />
            <BubbleButton
              active={editorState?.isHighlight ?? false}
              onClick={() => toggle(() => editor.chain().focus().toggleHighlight().run())}
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
