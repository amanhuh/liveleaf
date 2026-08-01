"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function LandingNavbar() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground font-semibold tracking-tight hover:opacity-90 transition-opacity"
            >
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-sans text-lg font-bold">LiveLeaf</span>
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-foreground transition-colors">
              Workflow
            </a>
            <a href="#playground" className="hover:text-foreground transition-colors">
              Playground
            </a>
          </nav>

          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative w-9 h-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Toggle color theme"
            >
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            <Button
              asChild
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 font-medium tracking-tight rounded-lg px-4 h-9 shadow-xs"
            >
              <Link href="/sign-up">
                Start writing — it's free
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative w-9 h-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Toggle color theme"
            >
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-border/50 bg-background/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-4 text-center">
              <nav className="flex flex-col gap-3 text-base font-medium text-muted-foreground">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-foreground transition-colors border-b border-border/30"
                >
                  Features
                </a>
                <a
                  href="#workflow"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-foreground transition-colors border-b border-border/30"
                >
                  Workflow
                </a>
                <a
                  href="#playground"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-foreground transition-colors"
                >
                  Playground
                </a>
              </nav>

              <div className="pt-2">
                <Button
                  asChild
                  className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium tracking-tight rounded-lg h-11"
                >
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    Start writing — it's free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
