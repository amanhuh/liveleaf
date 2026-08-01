"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";
import { User, LogOut, Moon, Sun, Monitor, Keyboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useEffect } from "react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabType = "account" | "appearance" | "shortcuts";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const TABS: { value: TabType; label: string; icon: typeof User }[] = [
  { value: "account", label: "Account", icon: User },
  { value: "appearance", label: "Appearance", icon: Monitor },
  { value: "shortcuts", label: "Shortcuts", icon: Keyboard },
];

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  const handleSignOut = async () => {
    onOpenChange(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] overflow-hidden p-0 gap-0">
        <div className="flex h-[440px]">
          {/* Left nav */}
          <aside className="w-44 shrink-0 flex flex-col gap-0.5 border-r border-border/60 bg-muted/20 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-2 pt-1 pb-2">
              Settings
            </p>
            {TABS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-sm transition-colors text-left cursor-pointer",
                  activeTab === value
                    ? "bg-background text-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/40 shrink-0">
              <DialogTitle className="text-sm font-semibold text-foreground">
                {TABS.find((t) => t.value === activeTab)?.label}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {activeTab === "account" && (
                <div className="space-y-6">
                  {/* Profile row */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-base overflow-hidden ring-1 ring-border/60">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name ?? "User"}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-tight truncate">
                        {user?.name || "LiveLeaf User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {user?.email || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-border/50" />

                  {/* Sign out */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2.5">
                      Danger zone
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/75 transition-colors cursor-pointer"
                    >
                      <LogOut className="size-3.5" />
                      Sign out of LiveLeaf
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-3">
                      Interface theme
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setTheme(value)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-2.5 py-5 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                            theme === value
                              ? "ring-1 ring-foreground/20 bg-accent text-foreground border-border/40"
                              : "border-border/60 bg-background/50 text-muted-foreground hover:border-border hover:text-foreground hover:bg-background",
                          )}
                        >
                          <Icon className="size-4" />
                          <span className="text-xs">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "shortcuts" && (
                <div className="rounded-lg border border-border/60 divide-y divide-border/40 text-xs">
                    <div className="flex items-center justify-between py-2.5 px-3">
                      <span className="text-foreground/90 font-medium">Search Pages</span>
                      <KbdGroup>
                        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                        <Kbd>K</Kbd>
                      </KbdGroup>
                    </div>
                    <div className="flex items-center justify-between py-2.5 px-3">
                      <span className="text-foreground/90 font-medium">Create New Page</span>
                      <KbdGroup>
                        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                        <Kbd>N</Kbd>
                      </KbdGroup>
                    </div>
                    <div className="flex items-center justify-between py-2.5 px-3">
                      <span className="text-foreground/90 font-medium">Open Trash Modal</span>
                      <KbdGroup>
                        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                        <Kbd>{isMac ? "⇧" : "Shift"}</Kbd>
                        <Kbd>T</Kbd>
                      </KbdGroup>
                    </div>
                    <div className="flex items-center justify-between py-2.5 px-3">
                      <span className="text-foreground/90 font-medium">Move Active Page to Trash</span>
                      <KbdGroup>
                        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                        <Kbd>{isMac ? "⇧" : "Shift"}</Kbd>
                        <Kbd>{isMac ? "⌫" : "Del"}</Kbd>
                      </KbdGroup>
                    </div>
                    <div className="flex items-center justify-between py-2.5 px-3">
                      <span className="text-foreground/90 font-medium">Toggle Sidebar</span>
                      <KbdGroup>
                        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                        <Kbd>\</Kbd>
                      </KbdGroup>
                    </div>
                    <div className="flex items-center justify-between py-2.5 px-3">
                      <span className="text-foreground/90 font-medium">Double-click Page Title</span>
                      <span className="text-muted-foreground italic text-[11px]">Rename page</span>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
