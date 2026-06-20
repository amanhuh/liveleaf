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

export function SlashMenu({
  items,
  command,
}: {
  items: SlashMenuItem[];
  command: (item: SlashMenuItem) => void;
}) {
  return (
    <Command className="w-72 rounded-lg border shadow-md">
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Blocks">
          {items.map((item) => (
            <CommandItem
              key={item.title}
              onSelect={() => command(item)}
            >
              {item.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}