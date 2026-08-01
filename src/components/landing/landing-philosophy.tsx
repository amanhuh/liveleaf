"use client";

import { Feather, EyeOff, ShieldCheck, Heart, Sparkles } from "lucide-react";

export function LandingPhilosophy() {
  const principles = [
    {
      icon: Feather,
      title: "Clarity over complexity",
      description: "Simple is powerful. Focus on writing without unnecessary features.",
    },
    {
      icon: EyeOff,
      title: "Built for deep thinking",
      description: "A calm design that respects your attention and protects focus.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy & control",
      description: "Your notes stay yours. Clean relational storage with auth bounds.",
    },
    {
      icon: Heart,
      title: "Crafted with care",
      description: "Thoughtful typography, micro-interactions, and visual harmony.",
    },
  ];

  return (
    <section id="philosophy" className="py-24 bg-muted/20 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Card: Version 1.0 */}
          <div className="lg:col-span-5 p-8 rounded-2xl border border-border/80 bg-card shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                VERSION 1.0
              </div>
              <h3 className="font-serif text-3xl font-normal text-foreground leading-snug">
                This is just <br />
                the beginning.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                LiveLeaf 1.0 is our first step toward a calmer, more thoughtful way of writing and organizing.
              </p>
            </div>

            <div className="pt-8 border-t border-border/50 space-y-2 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Rich Tiptap Block Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Fast Highlighted Search</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Nested Drag & Drop Hierarchy</span>
              </div>
            </div>
          </div>

          {/* Right Card: Philosophy */}
          <div className="lg:col-span-7 p-8 rounded-2xl border border-border/80 bg-card shadow-sm flex flex-col justify-between">
            <div className="space-y-4 mb-8">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                OUR PHILOSOPHY
              </div>
              <h3 className="font-serif text-3xl font-normal text-foreground leading-snug">
                Less noise. <span className="italic font-normal">More clarity.</span>
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We believe the right tools should fade into the background—so your thoughts can take center stage.
              </p>
            </div>

            {/* Principles 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
              {principles.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="p-2 rounded-lg bg-muted text-primary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xs text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
