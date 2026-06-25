import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
} from "lucide-react";
import type { CommandProps, SlashCommandItem } from "@/components/editor/types";

export const slashCommands: SlashCommandItem[] = [
  {
    title: "Heading 1",
    icon: Heading1,
    description: "Large section heading",
    searchTerms: ["h1", "heading", "title"],
    shortcut: "#",

    command: ({ editor, range }: CommandProps) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 1 })
        .run(),
  },

  {
    title: "Heading 2",
    icon: Heading2,
    description: "Medium section heading",
    searchTerms: ["h2", "heading", "subtitle"],
    shortcut: "##",

    command: ({ editor, range }: CommandProps) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 2 })
        .run(),
  },

  {
    title: "Bullet List",
    icon: List,
    description: "Create a bulleted list",
    searchTerms: ["bullet", "list", "unordered"],
    shortcut: "-",

    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },

  {
    title: "Numbered List",
    icon: ListOrdered,
    description: "Create a numbered list",
    searchTerms: ["number", "ordered", "list"],
    shortcut: "1.",

    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },

  {
    title: "Quote",
    icon: Quote,
    description: "Capture a quote or citation",
    searchTerms: ["quote", "blockquote", "citation"],
    shortcut: ">",

    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },

  {
    title: "Code Block",
    icon: Code2,
    description: "Write and format code",
    searchTerms: ["code", "snippet", "programming"],
    shortcut: "```",

    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },

  {
    title: "Divider",
    icon: Minus,
    description: "Insert a horizontal divider",
    searchTerms: ["divider", "rule", "horizontal"],
    shortcut: "---",

    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
];
