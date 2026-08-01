import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingEssentials } from "@/components/landing/landing-essentials";
import { LandingInteractiveDemo } from "@/components/landing/landing-interactive-demo";
import { LandingCTA } from "@/components/landing/landing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingEssentials />
        <LandingInteractiveDemo />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}