"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";

export function LandingHero() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden bg-background">
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/60 bg-muted/40 text-xs text-muted-foreground backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-foreground">LiveLeaf 1.0</span>
            <span className="text-muted-foreground/60">—</span>
            <span>Distraction-free personal knowledge workspace</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight text-foreground font-normal leading-[1.12]">
            Where ideas grow into <br />
            <span className="italic font-normal">living knowledge.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed font-sans font-normal">
            A peaceful Notion-inspired document workspace designed for deep focus. Write, organize, and search your thoughts with zero friction.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-foreground text-background font-medium tracking-tight hover:bg-foreground/90 transition-all shadow-md text-sm"
            >
              Start writing — it's free
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#interactive-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 h-12 rounded-xl border border-border/80 bg-background hover:bg-muted/60 text-foreground font-medium transition-colors text-sm"
            >
              Try Interactive Playground
            </a>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden p-2 sm:p-3">
            <div className="rounded-xl border border-border/40 bg-background overflow-hidden min-h-[600px] flex flex-col md:flex-row">
              <div className="w-full md:w-60 border-r border-border/40 p-4 space-y-4 bg-muted/10 text-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold px-2 py-1">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span>Aman's Workspace</span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <div className="px-2 py-1.5 rounded-md bg-muted text-foreground font-medium flex items-center justify-between">
                    <span>Project Vision</span>
                  </div>
                  <div className="px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                    <span>Mission & Principles</span>
                  </div>
                  <div className="px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                    <span>Product Roadmap</span>
                  </div>
                  <div className="px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                    <span>Book Notes — Deep Work</span>
                  </div>
                  <div className="px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                    <span>Weekly Journal</span>
                  </div>
                  <div className="px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                    <span>Ideas & Explorations</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 sm:p-10 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
                    Project Vision — 2026
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    Last edited 2 mins ago · 1,420 words
                  </p>
                </div>

                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    LiveLeaf is designed to offer a tranquil, distraction-free environment for structured personal writing. By combining a clean block editor with background autosave and rapid keyword search, LiveLeaf turns raw thoughts into long-term personal knowledge.
                  </p>
                  <div className="p-4 rounded-xl bg-muted/40 border-l-2 border-primary text-foreground font-sans text-xs">
                    "Simplicity is not about having less. It is about making room for what matters."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
