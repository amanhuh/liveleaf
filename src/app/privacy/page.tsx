import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/landing-footer";
import { constructMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy explaining how LiveLeaf protects and manages user data.",
  canonicalUrl: `${siteUrl}/privacy`,
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-foreground hover:opacity-90 transition-opacity"
          >
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span>LiveLeaf</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-10">
        <div className="space-y-3 border-b border-border/60 pb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
            PRIVACY & DATA PROTECTION
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Effective Date: August 1, 2026 · Last Updated: August 1, 2026
          </p>
        </div>

        <article className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm md:text-base leading-relaxed text-foreground/90 font-sans">
          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground">
              We collect minimal information necessary to provide the LiveLeaf Service, including your account profile details (such as your name, email address, and avatar provided via OAuth providers like GitHub or Google) and the note documents you create.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground">
              Your information is used strictly to deliver, maintain, and secure the LiveLeaf application experience, power full-text search indexing for your documents, and synchronize your personal workspace across devices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              3. Data Security & Storage
            </h2>
            <p className="text-muted-foreground">
              Your documents are stored in dedicated PostgreSQL database instances with native relational security parameters and strict row-level authorization boundaries. All data transmissions are encrypted using standard TLS protocols.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              4. Data Sharing & Third Parties
            </h2>
            <p className="text-muted-foreground">
              We do not sell, rent, or trade your personal information or document content to third parties or advertising networks under any circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              5. Your Rights & Data Export
            </h2>
            <p className="text-muted-foreground">
              You have the right to access, update, or permanently delete your account and associated documents at any time within your account settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              6. Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have any questions or concerns regarding our Privacy Policy or data handling practices, please contact me on {" "}
              <a
                href="https://x.com/oraggato"
                className="text-emerald-600 dark:text-emerald-400 font-medium underline underline-offset-4"
              >
                x.com
              </a>.
            </p>
          </section>
        </article>
      </main>

      <LandingFooter />
    </div>
  );
}
