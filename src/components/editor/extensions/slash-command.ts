import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";
import { ReactRenderer } from "@tiptap/react";
import { SlashMenu } from "@/components/editor/slash-menu";
import type { SuggestionProps, SuggestionKeyDownProps, SlashMenuRef } from "@/components/editor/types";

import { slashCommands } from "@/components/editor/extensions/slash-commands";



export const SlashCommand = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",

        items: ({ query }: { query: string }) => {
          return slashCommands.filter((item) => {
            const search = query.toLowerCase();

            return (
              item.title.toLowerCase().includes(search) ||
              item.searchTerms.some((term) =>
                term.toLowerCase().includes(search),
              )
            );
          });
        },

        render() {
          let component: ReactRenderer<SlashMenuRef>;
          let popup: ReturnType<typeof tippy>;

          return {
            onStart: (props: SuggestionProps) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              }) as ReactRenderer<SlashMenuRef>;

              if (!props.clientRect) {
                return;
              }

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect as () => DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },

            onUpdate(props: SuggestionProps) {
              component.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect as () => DOMRect,
              });
            },

            onKeyDown(props: SuggestionKeyDownProps) {
              if (props.event.key === "Escape") {
                popup?.[0]?.hide();
                return true;
              }

              if (component.ref?.onKeyDown) {
                return component.ref.onKeyDown(props);
              }

              return false;
            },

            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
