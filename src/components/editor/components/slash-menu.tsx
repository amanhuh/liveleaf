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
              <div className="flex w-full">
                <div className="mr-3">
                  <item.icon className="h-4 w-4" />
                </div>

                <div>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <div className="ml-auto">
                  <span className="text-sm text-muted-foreground">{item.shortcut}</span>
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
