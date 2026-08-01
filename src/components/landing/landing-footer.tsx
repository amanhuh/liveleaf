"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-muted/30 border-t border-border/60 pt-16 pb-12 text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border/40">
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Leaf className="w-5 h-5 text-primary fill-primary/20 group-hover:fill-primary transition-all duration-200" />
              <span className="font-sans font-semibold text-base tracking-tight text-foreground">
                LiveLeaf
              </span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              A calmer place for your thoughts. Write with clarity, organize naturally, and find anything.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All systems operational</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#product" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#organize" className="hover:text-foreground transition-colors">
                  Organize
                </a>
              </li>
              <li>
                <a href="#search" className="hover:text-foreground transition-colors">
                  Search
                </a>
              </li>
              <li>
                <a href="#essentials" className="hover:text-foreground transition-colors">
                  Essentials
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#interactive-demo" className="hover:text-foreground transition-colors">
                  Playground
                </a>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-foreground transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <div>© {new Date().getFullYear()} LiveLeaf Inc. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
