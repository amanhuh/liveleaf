"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  Edit3,
  FolderTree,
  Search,
  CheckCircle,
  SunMoon,
  ChevronRight,
  FileIcon,
  Bold,
  Italic,
  Highlighter,
  Code,
  Loader2,
  FileText,
} from "lucide-react";

export function LandingEssentials() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const [selectionStage, setSelectionStage] = useState<"idle" | "selecting" | "selected">("idle");

  const [dragPhase, setDragPhase] = useState<number>(0);

  const [typedQuery, setTypedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (hoveredCard === 1) {
      setSelectionStage("selecting");
      const timer = setTimeout(() => {
        setSelectionStage("selected");
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setSelectionStage("idle");
    }
  }, [hoveredCard]);

  useEffect(() => {
    if (hoveredCard === 2) {
      let isMounted = true;

      const runSequence = async () => {
        while (isMounted) {
          setDragPhase(1);
          await new Promise((r) => setTimeout(r, 300));
          if (!isMounted) break;

          setDragPhase(2);
          await new Promise((r) => setTimeout(r, 500));
          if (!isMounted) break;

          setDragPhase(3);
          await new Promise((r) => setTimeout(r, 450));
          if (!isMounted) break;

          setDragPhase(4);
          await new Promise((r) => setTimeout(r, 1200));
          if (!isMounted) break;

          setDragPhase(5);
          await new Promise((r) => setTimeout(r, 700));
          if (!isMounted) break;

          setDragPhase(0);
          await new Promise((r) => setTimeout(r, 1000));
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
          }, 250);
        }
      }, 100);

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
    <section id="essentials" className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
            Crafted Experience
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-foreground font-normal">
            The <span className="italic font-normal">essentials</span> for clear thinking.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg font-sans">
            Built with focus and precision. Nothing superfluous, everything intentional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="md:col-span-2 group p-8 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between relative overflow-hidden cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <Edit3 className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Distraction-free block editor
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg leading-relaxed font-sans">
                A peaceful writing surface designed to help you stay in flow. Format code blocks, callouts, lists, and headings naturally with slash <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">/</code> actions.
              </p>
            </div>

            <div className="mt-8 relative pt-10">
              <div className="p-4 rounded-2xl border border-border/50 bg-muted/20 text-xs font-sans text-muted-foreground leading-relaxed relative">
                <AnimatePresence>
                  {selectionStage === "selected" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.94 }}
                      transition={snappyTransition}
                      className="absolute -top-9 left-[132px] z-20 flex items-center gap-1 bg-popover/95 backdrop-blur-md border border-border/80 shadow-md rounded-lg p-1 text-muted-foreground"
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

                <span>Great ideas need room to breathe. Write with </span>
                <span className="relative inline-block">
                  <motion.span
                    animate={
                      selectionStage === "idle"
                        ? { width: "0%" }
                        : { width: "100%" }
                    }
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute inset-0 bg-primary/25 rounded z-0 pointer-events-none"
                  />
                  <span className="relative z-10 text-foreground font-medium px-0.5">
                    clarity and focus
                  </span>
                </span>
                <span> without distracting clutter.</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="group p-8 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <FolderTree className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Fluid page organization
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Structure your thoughts into flexible sub-pages with effortless drag-and-drop hierarchy.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl border border-border/50 bg-muted/20 text-xs font-sans space-y-1.5 relative overflow-hidden min-h-[145px]">
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
                    ? { y: 36 }
                    : { y: 0 }
                }
                transition={smoothDragTransition}
                className="space-y-1"
              >
                <div
                  className={`flex items-center gap-1.5 font-medium transition-all duration-200 p-1 -ml-1 rounded-md ${
                    dragPhase === 2
                      ? "bg-primary/10 text-primary border border-primary/30 font-semibold"
                      : "text-foreground border border-transparent"
                  }`}
                >
                  <ChevronRight className="w-3 h-3 text-muted-foreground rotate-90" />
                  <FileIcon className="w-3.5 h-3.5" />
                  <span>Project Vision</span>
                </div>
                <div className="pl-4 space-y-1 text-muted-foreground text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <FileIcon className="w-3 h-3 text-muted-foreground/60" />
                    <span>Mission & Principles</span>
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
                    ? { y: -24, x: 12, scale: 1.03, boxShadow: "0 10px 20px -4px rgba(0,0,0,0.15)" }
                    : dragPhase === 3
                    ? { y: -52, x: 0, scale: 1.03, boxShadow: "0 12px 24px -4px rgba(0,0,0,0.18)" }
                    : dragPhase === 4
                    ? { y: -52, x: 0, scale: 1, boxShadow: "none" }
                    : { y: 0, x: 0, scale: 1, boxShadow: "none" }
                }
                transition={smoothDragTransition}
                className="p-1.5 rounded-md bg-background border border-border/70 text-foreground flex items-center gap-1.5 z-10 relative cursor-pointer"
              >
                <FileIcon className="w-3.5 h-3.5 text-foreground" />
                <span className="font-medium text-[11px]">Book Notes</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="group p-8 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Instant search
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Locate any keyword across all your documents with real-time text snippet highlighting.
              </p>
            </div>

            <motion.div
              animate={hoveredCard === 3 ? { y: -2, scale: 1.01 } : { y: 0, scale: 1 }}
              transition={snappyTransition}
              className="mt-6 p-3 rounded-2xl border border-border/60 bg-popover/90 backdrop-blur-md shadow-md text-xs font-sans space-y-2 min-h-[110px]"
            >
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-foreground font-medium font-mono text-[11px]">
                  {hoveredCard === 3 ? typedQuery || "Search..." : "Search..."}
                </span>
                {isSearching && <Loader2 className="w-3 h-3 ml-auto animate-spin text-muted-foreground" />}
              </div>

              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={snappyTransition}
                  className="p-1.5 rounded-lg bg-accent/60 space-y-0.5"
                >
                  <div className="flex items-center gap-1.5 font-medium text-[11px] text-foreground">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <span>
                      <mark className="bg-primary/20 text-primary px-0.5 rounded">Design</mark> System
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground pl-4 truncate">
                    ...explore simple <mark className="bg-primary/20 text-primary px-0.5 rounded">design</mark> principles...
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="group p-8 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Continuous auto-save
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Every single word is saved continuously as you write. Never lose progress or a draft.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl border border-border/50 bg-muted/20 text-xs flex items-center justify-center gap-2 font-mono text-muted-foreground">
              <span className="relative flex h-2 w-2">
                {hoveredCard === 4 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Saved automatically</span>
            </div>
          </motion.div>

          <motion.div
            onMouseEnter={() => setHoveredCard(5)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
            transition={snappyTransition}
            className="group p-8 rounded-3xl border border-border/50 bg-card hover:border-foreground/25 hover:shadow-xl transition-colors duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <SunMoon className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-semibold text-xl text-foreground tracking-tight">
                Light & Dark modes
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Beautiful color themes designed for comfortable reading and writing day or night.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl border border-border/50 bg-muted/20 text-xs flex items-center justify-around font-mono text-muted-foreground">
              <span
                className={`px-3 py-1 rounded-full border transition-all duration-200 ${
                  hoveredCard === 5
                    ? "bg-muted text-muted-foreground border-border/40"
                    : "bg-background border-border/60 text-foreground"
                }`}
              >
                Light Mode
              </span>
              <span
                className={`px-3 py-1 rounded-full border transition-all duration-200 ${
                  hoveredCard === 5
                    ? "bg-foreground text-background border-foreground font-medium"
                    : "bg-background border-border/60 text-foreground"
                }`}
              >
                Dark Mode
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
