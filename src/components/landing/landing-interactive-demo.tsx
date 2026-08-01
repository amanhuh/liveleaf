"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { SlashCommand } from "@/components/editor/extensions/slash-command";
import { useState } from "react";
import {
  Maximize2,
  Minimize2,
  Check,
  RotateCcw,
  PanelLeft,
  FileText,
  Bold,
  Italic,
  Highlighter,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingInteractiveDemo() {
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [stats, setStats] = useState({ words: 16, chars: 98 });
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      SlashCommand,
      Placeholder.configure({
        placeholder: "Start writing...",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:float-left before:text-muted-foreground before:h-0 before:pointer-events-none opacity-60",
      }),
      Typography,
      Highlight,
    ],
    content: `
      <h2>Try LiveLeaf right here.</h2>
      <p>A clean, distraction-free writing environment. Select any text to trigger the format menu, or type <code>/</code> for block commands.</p>
    `,
    onUpdate: ({ editor }) => {
      setSaveStatus("saving");
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      setStats({ words, chars });
      setTimeout(() => setSaveStatus("saved"), 400);
    },
  });

  return (
    <section id="interactive-demo" className="py-24 bg-background border-t border-border/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
            Interactive Playground
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground font-normal">
            Experience the editor.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Select text for formatting or type <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded">/</code> on a new line.
          </p>
        </div>

        <div
          className={`rounded-2xl border border-border/80 bg-card shadow-xl transition-all duration-300 overflow-hidden relative focus-within:border-border/80 outline-none ring-0 border-none ${
            focusMode ? "p-8 sm:p-12 border-foreground/30 shadow-2xl" : "p-6 sm:p-8"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-6 text-xs">
            <div className="flex items-center gap-2">
              <PanelLeft className="size-4 text-muted-foreground" />
              <FileText className="size-3.5 text-foreground" />
              <span className="font-medium text-foreground">Sandbox Document</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-[11px] text-muted-foreground">
                {saveStatus === "saved" ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved
                  </span>
                ) : (
                  <span className="text-muted-foreground animate-pulse">
                    Saving...
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFocusMode(!focusMode)}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                {focusMode ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 mr-1" /> Exit Focus
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 mr-1" /> Focus Mode
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  editor?.commands.setContent(`
                    <h2>Try LiveLeaf right here.</h2>
                    <p>A clean, distraction-free writing environment. Select any text to trigger the format menu, or type <code>/</code> for block commands.</p>
                  `);
                }}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            </div>
          </div>

          {/* Editor Container - Completely border-free on focus */}
          <div className="min-h-[220px] prose dark:prose-invert max-w-none text-foreground outline-none ring-0 border-none [&_.tiptap]:outline-none [&_.tiptap]:border-none [&_.tiptap]:ring-0 [&_.tiptap]:shadow-none">
            {editor && (
              <BubbleMenu
                editor={editor}
                className="flex items-center gap-1 bg-popover/95 backdrop-blur-md border border-border p-1 rounded-lg shadow-lg text-foreground"
              >
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded hover:bg-muted ${
                    editor.isActive("bold") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded hover:bg-muted ${
                    editor.isActive("italic") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  className={`p-1.5 rounded hover:bg-muted ${
                    editor.isActive("highlight") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Highlighter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`p-1.5 rounded hover:bg-muted ${
                    editor.isActive("code") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
              </BubbleMenu>
            )}

            <EditorContent editor={editor} className="outline-none ring-0 border-none" />
          </div>

          <div className="pt-4 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between font-mono mt-6">
            <span>Live Document</span>
            <span>
              {stats.words} words · {stats.chars} characters
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
