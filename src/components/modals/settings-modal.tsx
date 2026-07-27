"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";
import { User, LogOut, Moon, Sun, Monitor, Laptop, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabType = "account" | "appearance";

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<TabType>("account");

  const handleSignOut = async () => {
    onOpenChange(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 gap-0 sm:rounded-xl border-sidebar-border">
        <DialogHeader className="p-4 border-b border-sidebar-border/60">
          <DialogTitle className="text-lg font-semibold tracking-tight">Settings</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Manage your account preferences and application settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-[420px] divide-x divide-sidebar-border/60">
          {/* Settings Sidebar Nav */}
          <aside className="w-48 p-2 space-y-1 bg-sidebar/30 shrink-0">
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "account"
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <User className="size-4" />
              <span>My Account</span>
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "appearance"
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <Sparkles className="size-4" />
              <span>Appearance</span>
            </button>
          </aside>

          {/* Settings Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Account Profile</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Your personal information and account details.
                  </p>

                  <div className="flex items-center gap-4 p-4 rounded-xl border border-sidebar-border/60 bg-sidebar/20">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg shrink-0">
                      {session?.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="size-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="size-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {session?.user?.name || "LiveLeaf User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session?.user?.email || "No email associated"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between py-2 border-b border-sidebar-border/40 text-xs">
                    <span className="text-muted-foreground">User ID</span>
                    <span className="font-mono text-[11px] text-foreground/80 truncate max-w-[220px]">
                      {session?.user?.id || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-sidebar-border/40 text-xs">
                    <span className="text-muted-foreground">Authentication Status</span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Session
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-sidebar-border/60">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full gap-2 text-xs font-medium cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out of Account</span>
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Appearance & Theme</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Customize how LiveLeaf looks on your screen.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-primary bg-primary/5 text-primary flex flex-col items-center justify-center gap-2 cursor-pointer">
                      <Moon className="size-6" />
                      <span className="text-xs font-semibold">Dark Theme</span>
                      <span className="text-[10px] text-muted-foreground">Default & Active</span>
                    </div>

                    <div className="p-4 rounded-xl border border-sidebar-border/60 bg-sidebar/20 text-muted-foreground flex flex-col items-center justify-center gap-2 opacity-60 cursor-not-allowed">
                      <Sun className="size-6" />
                      <span className="text-xs font-medium">Light Theme</span>
                      <span className="text-[10px]">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
