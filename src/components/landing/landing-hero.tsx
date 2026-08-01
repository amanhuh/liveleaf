"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Play,
  Check,
  Zap,
  Search,
  Lock,
  ChevronDown,
  ChevronRight,
  Star,
  MoreHorizontal,
  PlusIcon,
  Trash2,
  Settings,
  PanelLeft,
  FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  const [activeDoc, setActiveDoc] = useState<string>("doc-vision");

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-background">
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight text-foreground leading-[1.1] mb-6 font-normal">
            A calmer place <br className="hidden sm:inline" />
            for your <span className="italic font-normal">thoughts.</span>
            <span className="inline-block w-[2.5px] h-[0.85em] bg-foreground/80 ml-1.5 align-baseline animate-cursor-blink" />
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8 font-sans font-normal">
            Write with clarity. Organize naturally. Find anything.
            <br className="hidden sm:inline" />
            All in one peaceful workspace.
          </p>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-16">
            <div
              className="absolute inset-0 bg-emerald-500/[0.05] blur-2xl rounded-full pointer-events-none"
              aria-hidden="true"
            />
            <Button
              asChild
              size="lg"
              className="relative z-10 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-medium tracking-tight rounded-lg px-6 h-12 shadow-xs transition-all group"
            >
              <Link href="/sign-up">
                Start writing — it's free
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="relative z-10 w-full sm:w-auto border-border/80 hover:bg-muted/50 font-medium text-foreground rounded-lg px-6 h-12 transition-all"
            >
              <a href="#playground">
                <Play className="w-3.5 h-3.5 mr-2 fill-current" />
                Explore LiveLeaf
              </a>
            </Button>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto mt-12">
          <div className="hidden lg:flex absolute -top-6 -left-8 z-20 items-center gap-3 p-3 px-4 rounded-xl border border-border/60 bg-background/90 backdrop-blur-md shadow-md animate-float-slow">
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">
                Focus mode
              </div>
              <div className="text-[11px] text-muted-foreground">
                Distraction-free writing
              </div>
            </div>
          </div>

          <div className="hidden lg:flex absolute top-36 -left-12 z-20 items-center gap-3 p-3 px-4 rounded-xl border border-border/60 bg-background/90 backdrop-blur-md shadow-md animate-float-reverse">
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">
                Auto-save
              </div>
              <div className="text-[11px] text-muted-foreground">
                Saved automatically
              </div>
            </div>
          </div>

          <div className="hidden lg:flex absolute -top-4 -right-8 z-20 items-center gap-3 p-3 px-4 rounded-xl border border-border/60 bg-background/90 backdrop-blur-md shadow-md animate-float-reverse">
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">
                Instant Search
              </div>
              <div className="text-[11px] text-muted-foreground">
                Highlighted snippets
              </div>
            </div>
          </div>

          <div className="hidden lg:flex absolute top-32 -right-10 z-20 items-center gap-3 p-3 px-4 rounded-xl border border-border/60 bg-background/90 backdrop-blur-md shadow-md animate-float-slow">
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">
                Protected Notes
              </div>
              <div className="text-[11px] text-muted-foreground">
                Private & secure
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px] bg-background">
              <div className="hidden md:flex md:col-span-3 border-r border-border/60 p-2.5 bg-sidebar text-sidebar-foreground flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-1.5 rounded-md hover:bg-sidebar-accent flex items-center gap-2.5 cursor-pointer border border-border/30">
                    <div className="flex aspect-square size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground text-xs font-semibold">
                      A
                    </div>
                    <div className="grid flex-1 text-left text-xs leading-tight">
                      <span className="truncate font-medium text-foreground">Aman</span>
                      <span className="truncate text-[10px] text-muted-foreground">
                        amngupta402@gmail.com
                      </span>
                    </div>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="px-1 py-0.5 flex items-center gap-1 text-muted-foreground font-medium text-[11px]">
                      <ChevronDown className="size-3 text-muted-foreground" />
                      <span>Favorites</span>
                    </div>
                    <div className="px-2 py-1 text-xs text-muted-foreground/50 italic">
                      No favorited pages
                    </div>
                  </div>

                  <div className="space-y-0.5 text-xs">
                    <div className="px-1 py-0.5 flex items-center justify-between text-muted-foreground font-medium text-[11px]">
                      <span>Pages</span>
                      <PlusIcon className="size-3.5 cursor-pointer hover:text-foreground" />
                    </div>

                    <div
                      onClick={() => setActiveDoc("doc-vision")}
                      className={`px-2 py-1.5 rounded-md flex items-center gap-2 cursor-pointer transition-colors ${
                        activeDoc === "doc-vision"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <ChevronRight className="size-3 rotate-90" />
                      <FileIcon className="size-3.5" />
                      <span className="truncate">Project Vision</span>
                    </div>

                    <div className="pl-4 space-y-0.5">
                      <div className="px-2 py-1.5 rounded-md flex items-center gap-2 text-muted-foreground hover:bg-sidebar-accent/50 cursor-pointer">
                        <FileIcon className="size-3.5" />
                        <span className="truncate">Mission & Principles</span>
                      </div>
                      <div className="px-2 py-1.5 rounded-md flex items-center gap-2 text-muted-foreground hover:bg-sidebar-accent/50 cursor-pointer">
                        <FileIcon className="size-3.5" />
                        <span className="truncate">Product Roadmap</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveDoc("doc-book")}
                      className={`px-2 py-1.5 rounded-md flex items-center gap-2 cursor-pointer transition-colors ${
                        activeDoc === "doc-book"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <FileIcon className="size-3.5" />
                      <span className="truncate">Book Notes — Deep Work</span>
                    </div>

                    <div
                      onClick={() => setActiveDoc("doc-journal")}
                      className={`px-2 py-1.5 rounded-md flex items-center gap-2 cursor-pointer transition-colors ${
                        activeDoc === "doc-journal"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <FileIcon className="size-3.5" />
                      <span className="truncate">Weekly Journal</span>
                    </div>

                    <div
                      onClick={() => setActiveDoc("doc-ideas")}
                      className={`px-2 py-1.5 rounded-md flex items-center gap-2 cursor-pointer transition-colors ${
                        activeDoc === "doc-ideas"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <FileIcon className="size-3.5" />
                      <span className="truncate">Ideas & Explorations</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-sidebar-border space-y-0.5 text-xs text-muted-foreground">
                  <div className="px-2 py-1.5 rounded-md flex items-center gap-2 hover:bg-sidebar-accent cursor-pointer">
                    <Search className="size-3.5" />
                    <span>Search</span>
                  </div>
                  <div className="px-2 py-1.5 rounded-md flex items-center gap-2 hover:bg-sidebar-accent cursor-pointer">
                    <Trash2 className="size-3.5" />
                    <span>Trash</span>
                  </div>
                  <div className="px-2 py-1.5 rounded-md flex items-center gap-2 hover:bg-sidebar-accent cursor-pointer">
                    <Settings className="size-3.5" />
                    <span>Settings</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-9 p-6 sm:p-10 flex flex-col justify-between relative bg-background">
                <div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-8 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <PanelLeft className="size-4 text-muted-foreground cursor-pointer hover:text-foreground mr-1" />
                      <span>Personal</span>
                      <ChevronRight className="size-3 text-muted-foreground/60" />
                      <span className="text-foreground font-medium">
                        {activeDoc === "doc-vision"
                          ? "Project Vision"
                          : activeDoc === "doc-book"
                          ? "Book Notes — Deep Work"
                          : activeDoc === "doc-journal"
                          ? "Weekly Journal"
                          : "Ideas & Explorations"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 rounded-md hover:bg-accent text-muted-foreground">
                        <Star className="size-4" />
                      </button>
                      <button className="p-1 rounded-md hover:bg-accent text-muted-foreground">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  </div>

                  <h2 className="font-sans text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-6">
                    {activeDoc === "doc-vision"
                      ? "Project Vision"
                      : activeDoc === "doc-book"
                      ? "Book Notes — Deep Work"
                      : activeDoc === "doc-journal"
                      ? "Weekly Journal"
                      : "Ideas & Explorations"}
                  </h2>

                  {activeDoc === "doc-vision" ? (
                    <div className="space-y-4 text-base text-foreground/90 leading-relaxed font-sans">
                      <blockquote className="pl-4 border-l-2 border-border text-muted-foreground italic my-4">
                        "Great ideas need room to breathe."
                      </blockquote>
                      <p className="text-muted-foreground">
                        LiveLeaf gives you a calm, distraction-free environment to think, draft, and structure your thoughts.
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-foreground/90 text-sm">
                        <li>Clarity over complexity</li>
                        <li>Depth over feature bloat</li>
                        <li>Craftsmanship over trends</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-4 text-base text-foreground/90 leading-relaxed font-sans">
                      <p className="text-muted-foreground">
                        Distraction-free environments allow deep, uninterrupted work sessions that yield long-term focus.
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-foreground/90 text-sm">
                        <li>Focus deeply without context switching</li>
                        <li>Protect your attention from noise</li>
                        <li>Build simple habits that scale naturally</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-8 border-t border-border/40 flex items-center justify-end text-xs text-muted-foreground font-mono">
                  <div>132 words · 742 characters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}