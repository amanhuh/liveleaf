"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SlashMenuProps } from "@/components/editor/types";

export const SlashMenu = forwardRef(function SlashMenu(props: SlashMenuProps, ref) {
  const { items, editor, range } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useLayoutEffect(() => {
    itemRefs.current[selectedIndex]
    ?.scrollIntoView({
      block: "nearest",
    });
  }, [selectedIndex]);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      item.command({ editor, range });
    },
    [items, editor, range],
  );

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
        return true;
      }

      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev >= items.length - 1 ? 0 : prev + 1));
        return true;
      }

      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  return (
    <Command
      shouldFilter={false}
      value={items[selectedIndex]?.title}
      onValueChange={(val) => {
        const idx = items.findIndex(
          (item) => item.title.toLowerCase() === val.toLowerCase(),
        );
        if (idx !== -1) setSelectedIndex(idx);
      }}
      className="w-80 rounded-xl border bg-background shadow-lg"
    >
      <CommandList ref={listRef} className="max-h-80 overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Basic Blocks">
          {items.map((item, index: number) => (
            <CommandItem
              key={item.title}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              value={item.title}
              onSelect={() => selectItem(index)}
              className="gap-3 py-2"
            >
              <div className="flex w-full items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md border">
                  <item.icon className="h-4 w-4" />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.title}</span>

                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>

                <span className="ml-auto text-xs text-muted-foreground">
                  {item.shortcut}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
});
