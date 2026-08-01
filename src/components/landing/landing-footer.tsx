import Link from "next/link";
import { Leaf } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 bg-background text-muted-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground font-semibold tracking-tight hover:opacity-90 transition-opacity"
            >
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-sans text-lg font-bold">LiveLeaf</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm font-sans">
              A peaceful, distraction-free document workspace designed for deep focus, rapid search, and fluid thought organization.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-medium">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-foreground transition-colors">
                  Workflow
                </a>
              </li>
              <li>
                <a href="#playground" className="hover:text-foreground transition-colors">
                  Playground
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-medium">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-muted-foreground">
          <p>© {new Date().getFullYear()} LiveLeaf. All rights reserved.</p>
          <div className="font-mono text-[11px]">
            Designed for personal focus
          </div>
        </div>
      </div>
    </footer>
  );
}
