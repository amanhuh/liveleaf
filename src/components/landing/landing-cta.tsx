"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section id="cta" className="py-24 bg-background border-t border-border/40 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-foreground leading-tight">
          Ready to experience a calmer <br />
          <span className="italic font-normal">writing workspace?</span>
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto font-sans">
          Start writing in your personal LiveLeaf workspace today. Free forever, no credit card required.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-medium tracking-tight rounded-xl px-6 h-12 shadow-xs transition-all cursor-pointer group"
          >
            <Link href="/sign-up">
              Start writing — it's free
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
