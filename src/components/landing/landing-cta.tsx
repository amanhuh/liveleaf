"use client";

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-6">
          <Leaf className="w-6 h-6 fill-primary/20" />
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-foreground font-normal mb-4">
          Ready to create your space?
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 font-sans font-normal">
          Join writers, researchers, and thinkers who choose clarity over clutter.
        </p>

        <Button
          asChild
          size="lg"
          className="bg-foreground text-background hover:bg-foreground/90 font-medium tracking-tight rounded-lg px-8 h-13 text-base shadow-md hover:shadow-lg transition-all group"
        >
          <Link href="/sign-up">
            Start writing — it's free
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
