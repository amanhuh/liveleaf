import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
} from "lucide-react";
import type { Editor } from "@tiptap/core";

export const slashCommands = [
  {
    title: "Heading 1",
    icon: Heading1,
    command: ({ editor, range } : { editor: Editor, range: { from: number, to: number }}) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },

  {
    title: "Heading 2",
    icon: Heading2,
    command: ({ editor, range } : { editor: Editor, range: { from: number, to: number }}) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },

  {
    title: "Bullet List",
    icon: List,
    command: ({ editor, range } : { editor: Editor, range: { from: number, to: number }}) =>
      editor.chain().focus().toggleBulletList().run(),
  },

  {
    title: "Numbered List",
    icon: ListOrdered,
    command: ({ editor, range } : { editor: Editor, range: { from: number, to: number }}) =>
      editor.chain().focus().toggleOrderedList().run(),
  },

  {
    title: "Quote",
    icon: Quote,
    command: ({ editor, range } : { editor: Editor, range: { from: number, to: number }}) =>
      editor.chain().focus().toggleBlockquote().run(),
  },

  {
    title: "Code Block",
    icon: Code2,
    command: ({ editor, range } : { editor: Editor, range: { from: number, to: number }}) =>
      editor.chain().focus().toggleCodeBlock().run(),
  },
];