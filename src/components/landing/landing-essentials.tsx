"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  Star,
  ChevronRight,
  FileIcon,
  Bold,
  Italic,
  Highlighter,
  Code,
  Loader2,
  FileText,
  Search,
} from "lucide-react";

export function LandingEssentials() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectionStage, setSelectionStage] = useState<"idle" | "selecting" | "selected">("idle");
  const [dragPhase, setDragPhase] = useState<number>(0);
  const [typedQuery, setTypedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Card 1: Selection & Bubble Menu Trigger
  useEffect(() => {
    if (hoveredCard === 1) {
      setSelectionStage("selecting");
      const timer = setTimeout(() => {
        setSelectionStage("selected");
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSelectionStage("idle");
    }
  }, [hoveredCard]);

  // Card 2: 5-Phase Synchronized Drag & Drop Loop
  useEffect(() => {
    if (hoveredCard === 2) {
      let isMounted = true;

      const runSequence = async () => {
        while (isMounted) {
          // Phase 1: Pickup lift
          setDragPhase(1);
          await new Promise((r) => setTimeout(r, 350));
          if (!isMounted) break;

          // Phase 2: Drag over folder (whole tree highlight)
          setDragPhase(2);
          await new Promise((r) => setTimeout(r, 550));
          if (!isMounted) break;

          // Phase 3: Drag to top indicator line
          setDragPhase(3);
          await new Promise((r) => setTimeout(r, 450));
          if (!isMounted) break;

          // Phase 4: Drop at top & Hold Pause
          setDragPhase(4);
          await new Promise((r) => setTimeout(r, 1200));
          if (!isMounted) break;

          // Phase 5: Return to bottom
          setDragPhase(5);
          await new Promise((r) => setTimeout(r, 700));
          if (!isMounted) break;

          setDragPhase(0);
          await new Promise((r) => setTimeout(r, 800));
        }
      };

      runSequence();

      return () => {
        isMounted = false;
        setDragPhase(0);
      };
    } else {
      setDragPhase(0);
    }
  }, [hoveredCard]);

  // Card 3: Typing Search Sequence (Results strictly after typing ends)
  useEffect(() => {
    if (hoveredCard === 3) {
      setTypedQuery("");
      setShowResults(false);
      setIsSearching(false);

      const target = "design";
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < target.length) {
          setTypedQuery(target.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsSearching(true);
          setTimeout(() => {
            setIsSearching(false);
            setShowResults(true);
          }, 350);
        }
      }, 120);

      return () => clearInterval(typingInterval);
    } else {
      setTypedQuery("");
      setIsSearching(false);
      setShowResults(false);
    }
  }, [hoveredCard]);

  const snappyTransition = {
    type: "spring" as const,
    stiffness: 380,
    damping: 24,
  };

  const smoothDragTransition = {
    type: "spring" as const,
    stiffness: 140,
    damping: 20,
  };

  return (
    <section id="workflow" className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-foreground font-normal">
            The <span className="italic font-normal">essentials</span> for clear thinking.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg font-sans">
            Built with focus and precision. Nothing superfluous, everything intentional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Block Editor (overflow-hidden to fix bottom corner bleed) */}
          <motion.div
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="md:col-span-2 group p-8 pb-0 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between relative overflow-hidden cursor-pointer"
          >
            <div className="space-y-3">
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Distraction-free block editor
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg leading-relaxed font-sans">
                A peaceful writing surface designed to help you stay in flow. Format code blocks, callouts, lists, and headings naturally with slash <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">/</code> actions.
              </p>
            </div>

            {/* Inset bottom card frame */}
            <div className="mt-8 rounded-t-2xl border border-border/60 border-b-0 bg-muted/20 p-5 pb-8 relative overflow-hidden -mb-2">
              <div className="text-xs sm:text-sm font-sans text-muted-foreground leading-relaxed relative pt-6">
                <AnimatePresence>
                  {(selectionStage === "selected" || hoveredCard === 1) && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.94 }}
                      transition={snappyTransition}
                      className="absolute top-0 left-[180px] z-20 flex items-center gap-1 bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg p-1 text-muted-foreground"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>

                <span>Great ideas need room to breathe. LiveLeaf gives you a calm, distraction-free environment to think, draft, and format your thoughts with </span>
                <span className="relative inline-block">
                  <motion.span
                    animate={
                      hoveredCard === 1 || selectionStage === "selected"
                        ? { width: "100%" }
                        : { width: "0%" }
                    }
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/25 rounded z-0 pointer-events-none"
                  />
                  <span
                    className={`relative z-10 font-medium px-0.5 transition-colors duration-200 ${
                      hoveredCard === 1 || selectionStage === "selected"
                        ? "text-emerald-950 dark:text-emerald-200 font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    clarity and focus
                  </span>
                </span>
                <span> without distracting clutter.</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Page Hierarchy Drag & Drop */}
          <motion.div
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="group p-8 pb-0 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="space-y-3">
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Fluid page organization
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Structure your thoughts into flexible sub-pages with effortless drag-and-drop hierarchy.
              </p>
            </div>

            <div className="mt-8 rounded-t-2xl border border-border/60 border-b-0 bg-muted/20 p-4 pb-6 relative overflow-hidden -mb-2 min-h-[160px]">
              <AnimatePresence>
                {dragPhase === 3 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ duration: 0.15 }}
                    className="h-[2px] bg-primary rounded-full my-0.5 shadow-2xs origin-left"
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={
                  dragPhase === 3 || dragPhase === 4
                    ? { y: 40 }
                    : { y: 0 }
                }
                transition={smoothDragTransition}
                className="space-y-1"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    dragPhase === 2
                      ? "bg-primary/10 border border-primary/30 shadow-xs"
                      : "bg-transparent border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-1.5 h-8 font-medium text-xs text-foreground px-1">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground rotate-90" />
                    <FileIcon className="w-3.5 h-3.5" />
                    <span>Project Vision</span>
                  </div>
                  <div className="pl-5 space-y-1 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1.5 h-7">
                      <FileIcon className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <span>Mission & Principles</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={
                  dragPhase === 0
                    ? { y: 0, x: 0, scale: 1, boxShadow: "none" }
                    : dragPhase === 1
                    ? { y: -2, x: 0, scale: 1.03, boxShadow: "0 8px 16px -4px rgba(0,0,0,0.12)" }
                    : dragPhase === 2
                    ? { y: -30, x: 12, scale: 1.03, boxShadow: "0 10px 20px -4px rgba(0,0,0,0.15)" }
                    : dragPhase === 3
                    ? { y: -64, x: 0, scale: 1.03, boxShadow: "0 12px 24px -4px rgba(0,0,0,0.18)" }
                    : dragPhase === 4
                    ? { y: -64, x: 0, scale: 1, boxShadow: "none" }
                    : { y: 0, x: 0, scale: 1, boxShadow: "none" }
                }
                transition={smoothDragTransition}
                className="h-8 px-2.5 rounded-lg bg-background border border-border/70 text-foreground flex items-center gap-2 z-10 relative cursor-pointer text-xs font-medium"
              >
                <FileIcon className="w-3.5 h-3.5 text-foreground" />
                <span>Book Notes</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Card 3: Instant Search */}
          <motion.div
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="group p-8 pb-0 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="space-y-3">
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Instant search
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Locate any keyword across all your documents with real-time text snippet highlighting.
              </p>
            </div>

            <div className="mt-8 rounded-t-2xl border border-border/60 border-b-0 bg-muted/20 p-4 pb-6 relative overflow-hidden -mb-2 min-h-[120px]">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-foreground font-medium font-mono text-[11px]">
                  {hoveredCard === 3 ? typedQuery || "Search..." : "Search..."}
                </span>
                {isSearching && <Loader2 className="w-3 h-3 ml-auto animate-spin text-muted-foreground" />}
              </div>

              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={snappyTransition}
                    className="p-2 rounded-lg bg-background border border-border/60 shadow-2xs space-y-0.5 mt-2"
                  >
                    <div className="flex items-center gap-1.5 font-medium text-[11px] text-foreground">
                      <FileText className="w-3 h-3 text-muted-foreground" />
                      <span>
                        <mark className="bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300 font-medium px-1 rounded">
                          Design
                        </mark>{" "}
                        System
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground pl-4 truncate">
                      ...explore simple{" "}
                      <mark className="bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300 font-medium px-1 rounded">
                        design
                      </mark>{" "}
                      principles...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Card 4: Continuous Auto-Save */}
          <motion.div
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="group p-8 pb-0 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="space-y-3">
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Continuous auto-save
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Every single word is saved continuously as you write. Never lose progress or a draft.
              </p>
            </div>

            <div className="mt-8 rounded-t-2xl border border-border/60 border-b-0 bg-muted/20 p-5 pb-6 relative overflow-hidden -mb-2 flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                {hoveredCard === 4 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Saved automatically</span>
            </div>
          </motion.div>

          {/* Card 5: Starred Favorites */}
          <motion.div
            onMouseEnter={() => setHoveredCard(5)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="group p-8 pb-0 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="space-y-3">
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Starred favorites
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Pin your most important notes to the top of your sidebar for instant one-click access.
              </p>
            </div>

            <div className="mt-8 rounded-t-2xl border border-border/60 border-b-0 bg-muted/20 p-4 pb-6 relative overflow-hidden -mb-2 space-y-2">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Favorites
              </div>

              <motion.div
                animate={hoveredCard === 5 ? { y: -2 } : { y: 0 }}
                transition={snappyTransition}
                className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/70 shadow-2xs text-xs font-sans"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileIcon className="w-3.5 h-3.5 text-foreground" />
                  <span className="font-medium text-foreground truncate text-[11px]">Project Vision</span>
                </div>
                <motion.div
                  animate={
                    hoveredCard === 5
                      ? { rotate: [0, -14, 14, -8, 8, 0], scale: [1, 1.25, 1] }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <Star
                    className={`w-4 h-4 transition-colors duration-200 ${
                      hoveredCard === 5
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                        : "text-muted-foreground/50"
                    }`}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
