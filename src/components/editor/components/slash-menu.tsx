"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type SlashMenuItem = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  // allow additional properties
  [key: string]: unknown;
};

export function SlashMenu(props: any) {
  const { items, editor, range } = props;

  return (
    <Command className="w-72 rounded-lg border shadow-md">
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Blocks">
          {items.map((item: any) => (
            <CommandItem
              key={item.title}
              onSelect={() => {
                item.command({
                  editor,
                  range,
                });
              }}
            >
              {item.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}