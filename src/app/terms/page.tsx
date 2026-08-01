import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/landing-footer";
import { constructMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service",
  description: "Terms of Service for using LiveLeaf writing and personal knowledge management platform.",
  canonicalUrl: `${siteUrl}/terms`,
});

export default function TermsPage() {
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
            LEGAL AGREEMENT
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Effective Date: August 1, 2026 · Last Updated: August 1, 2026
          </p>
        </div>

        <article className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm md:text-base leading-relaxed text-foreground/90 font-sans">
          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing or using LiveLeaf (&quot;the Service&quot;), provided by LiveLeaf Team (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              2. Description of Service
            </h2>
            <p className="text-muted-foreground">
              LiveLeaf is a personal knowledge management and writing platform designed to provide a calm, distraction-free writing environment with real-time text formatting, page organization, and fast full-text search.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              3. User Accounts & Responsibilities
            </h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              4. Data Ownership & Content
            </h2>
            <p className="text-muted-foreground">
              You retain full ownership of all notes, documents, text, and media content that you write, upload, or store within LiveLeaf. We do not claim any intellectual property rights over your content.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              5. Acceptable Use Policy
            </h2>
            <p className="text-muted-foreground">
              You agree not to use the Service for any unlawful activities, to attempt to disrupt or bypass application security boundaries, or to transmit malicious code or malware.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              6. Service Availability & Modification
            </h2>
            <p className="text-muted-foreground">
              We continuously improve LiveLeaf and may modify or update features over time. We strive to maintain continuous uptime but do not guarantee uninterrupted access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              7. Termination
            </h2>
            <p className="text-muted-foreground">
              You may terminate your account at any time. We reserve the right to suspend or terminate accounts that violate these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground border-b border-border/40 pb-2">
              8. Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have any questions regarding these Terms of Service, please contact us at{" "}
              <a
                href="mailto:support@liveleaf.app"
                className="text-emerald-600 dark:text-emerald-400 font-medium underline underline-offset-4"
              >
                support@liveleaf.app
              </a>.
            </p>
          </section>
        </article>
      </main>

      <LandingFooter />
    </div>
  );
}
