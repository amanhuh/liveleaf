import type { Document } from "@/types/document.types";
import type { Editor } from "@tiptap/core";
import type { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import type { LucideIcon } from "lucide-react";

export type TiptapProps = {
  document: Document;
  content: string;
};

export type CommandProps = {
  editor: Editor;
  range: {
    from: number;
    to: number;
  };
};

export type SlashCommandItem = {
  title: string;
  icon: LucideIcon;
  description: string;
  searchTerms: string[];
  shortcut: string;
  command: (props: CommandProps) => void;
};

export type SlashMenuRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export interface SlashMenuProps extends Omit<SuggestionProps, "items"> {
  items: SlashCommandItem[];
}

export type { SuggestionKeyDownProps, SuggestionProps };