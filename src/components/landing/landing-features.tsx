"use client";

import { useState } from "react";
import {
  Code,
  FileText,
  Heading,
  Quote,
  Edit3,
  PanelLeft,
  Bold,
  Italic,
  Highlighter,
  List,
} from "lucide-react";

export function LandingFeatures() {
  const [activeFeature, setActiveFeature] = useState<"slash" | "bubble" | "rich">("slash");

  return (
    <section id="features" className="py-24 bg-muted/15 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground font-normal leading-tight">
                Write your way to <br className="hidden sm:inline" />
                better focus.
              </h2>

              <p className="text-base text-muted-foreground leading-relaxed font-sans">
                A distraction-free block editor designed to keep you in flow. Smart slash commands and fast formatting when you need them.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div
                onClick={() => setActiveFeature("slash")}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeFeature === "slash"
                    ? "bg-background border-border shadow-xs text-foreground"
                    : "bg-transparent border-transparent hover:bg-background/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-3 font-semibold text-sm mb-1">
                  <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-xs font-mono text-foreground">
                    /
                  </div>
                  <span>Slash menu for quick actions</span>
                </div>
                <p className="text-xs text-muted-foreground pl-9 leading-relaxed">
                  Type <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded">/</code> to insert headings, code blocks, or lists without taking your hands off the keyboard.
                </p>
              </div>

              <div
                onClick={() => setActiveFeature("bubble")}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeFeature === "bubble"
                    ? "bg-background border-border shadow-xs text-foreground"
                    : "bg-transparent border-transparent hover:bg-background/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-3 font-semibold text-sm mb-1">
                  <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-foreground">
                    <Edit3 className="w-3.5 h-3.5" />
                  </div>
                  <span>Bubble menu formatting</span>
                </div>
                <p className="text-xs text-muted-foreground pl-9 leading-relaxed">
                  Select any word or passage to trigger inline formatting controls for bold, italic, highlights, and code.
                </p>
              </div>

              <div
                onClick={() => setActiveFeature("rich")}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeFeature === "rich"
                    ? "bg-background border-border shadow-xs text-foreground"
                    : "bg-transparent border-transparent hover:bg-background/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-3 font-semibold text-sm mb-1">
                  <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-foreground">
                    <List className="w-3.5 h-3.5" />
                  </div>
                  <span>Rich text & block structures</span>
                </div>
                <p className="text-xs text-muted-foreground pl-9 leading-relaxed">
                  Headings, callouts, blockquotes, bulleted lists, and syntax-highlighted code blocks with spacious layout.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 pb-4 border-b border-border/50 text-xs text-muted-foreground mb-6">
                <PanelLeft className="size-3.5 text-muted-foreground" />
                <FileText className="w-3.5 h-3.5 text-foreground" />
                <span className="font-medium text-foreground">Reading List</span>
              </div>

              <div className="flex-1 space-y-6">
                {activeFeature === "slash" && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-2xl font-medium text-foreground">
                      Reading list — Literature
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                      In the quiet corners of Willow Creek, truth and clarity whisper louder than noise.
                    </p>
                    <div className="mt-4 p-2 rounded-xl border border-border bg-popover shadow-lg max-w-xs space-y-1">
                      <div className="text-[10px] font-mono text-muted-foreground px-2 py-1 uppercase tracking-wider">
                        Basic Blocks
                      </div>
                      <div className="p-2 rounded-lg bg-accent flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                        <Heading className="w-4 h-4 text-foreground" />
                        <div>Heading 1</div>
                      </div>
                      <div className="p-2 rounded-lg hover:bg-muted/50 flex items-center gap-2.5 text-xs text-muted-foreground cursor-pointer">
                        <Quote className="w-4 h-4" />
                        <div>Quote Block</div>
                      </div>
                      <div className="p-2 rounded-lg hover:bg-muted/50 flex items-center gap-2.5 text-xs text-muted-foreground cursor-pointer">
                        <Code className="w-4 h-4" />
                        <div>Code Block</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeature === "bubble" && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-2xl font-medium text-foreground">
                      Reading list — Literature
                    </h3>
                    <div className="relative pt-8">
                      <div className="absolute top-0 left-4 z-10 flex items-center gap-1 bg-popover border border-border shadow-md rounded-lg p-1 text-foreground">
                        <div className="p-1.5 rounded bg-muted text-foreground">
                          <Bold className="w-3.5 h-3.5" />
                        </div>
                        <div className="p-1.5 rounded hover:bg-muted text-foreground">
                          <Italic className="w-3.5 h-3.5" />
                        </div>
                        <div className="p-1.5 rounded hover:bg-muted text-amber-500">
                          <Highlighter className="w-3.5 h-3.5" />
                        </div>
                        <div className="p-1.5 rounded hover:bg-muted text-foreground">
                          <Code className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                        In the quiet corners of Willow Creek,{" "}
                        <mark className="bg-primary/20 text-primary px-1 rounded font-medium">
                          truth and clarity
                        </mark>{" "}
                        whisper louder than noise.
                      </p>
                    </div>
                  </div>
                )}

                {activeFeature === "rich" && (
                  <div className="space-y-5">
                    <h3 className="font-serif text-2xl font-medium text-foreground">
                      Structured Thoughts
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                      Deep concentration allows long-term value creation.
                    </p>
                    <blockquote className="pl-4 border-l-2 border-border text-muted-foreground italic text-xs py-1">
                      "Clarity of thought requires clarity of tool."
                    </blockquote>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground/90">
                      <li>Rule 1: Work deeply without context switching</li>
                      <li>Rule 2: Embrace boredom to reset focus</li>
                      <li>Rule 3: Protect your attention from noise</li>
                    </ul>
                    <div className="p-3 rounded-lg border border-border bg-muted/30 font-mono text-xs text-foreground">
                      <span className="font-bold text-foreground">const</span> focus ={" "}
                      <span className="text-muted-foreground font-medium">"uninterrupted"</span>;
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border/40 text-[11px] text-muted-foreground flex justify-end font-mono">
                <span>Autosaved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
