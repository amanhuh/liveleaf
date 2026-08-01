import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — LiveLeaf",
  description: "Comprehensive Privacy Policy for LiveLeaf personal document workspace.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Leaf className="w-5 h-5 text-primary" />
            <span>LiveLeaf</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-10">
        <div className="space-y-3 border-b border-border/40 pb-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: August 1, 2026 · Version 1.0
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">1. Privacy Philosophy</h2>
            <p>
              LiveLeaf is built on the fundamental principle that your thoughts, notes, and research belong entirely to you. We are committed to maintaining a private, distraction-free environment free from advertising networks, behavioral tracking, or data monetization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">2. Information We Collect</h2>
            <p>We restrict data collection exclusively to information necessary to deliver the workspace experience:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li><strong>Account Identifiers</strong>: When you authenticate via OAuth providers (GitHub or Google), we receive your primary email address, display name, and avatar URL to provision your account session.</li>
              <li><strong>Document Content</strong>: Page titles, document body text, tree nesting hierarchy, favorited states, and trash markers required to provide full-text search and continuous background autosave.</li>
              <li><strong>Technical Diagnostic Logs</strong>: Server response codes, database latency metrics, and error stack trace logs retained temporarily for performance monitoring.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">3. Zero Third-Party Advertising & Data Selling</h2>
            <p>
              We do not sell, rent, trade, or share your personal data or document content with any third-party advertisers, data brokers, or external analytics aggregators. Your notes are never processed for ad targeting or commercial profiling.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">4. Instant Search & Data Protection</h2>
            <p>
              Your document text is processed securely in real-time to power instant search queries across your page titles and body snippets. Search indexing operations occur strictly within our protected application environment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">5. Cookies & Local Storage</h2>
            <p>
              LiveLeaf uses HTTP-only authentication cookies and client-side `localStorage` exclusively to maintain your active login session, save your dark/light theme preference (`next-themes`), and persist sidebar tree expansion states. We do not use tracking pixels or cross-site fingerprinting scripts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">6. Data Retention & Permanent Erasure</h2>
            <p>
              Documents soft-deleted within LiveLeaf move to your workspace Trash modal, where you retain complete control to restore them or execute permanent purging. Permanent deletion removes target records from active storage tables.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">7. Security Infrastructure</h2>
            <p>
              All traffic between your browser and LiveLeaf servers is encrypted in transit via Transport Layer Security (TLS 1.3). Database storage relies on encrypted-at-rest data infrastructure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">8. Policy Updates</h2>
            <p>
              We may update this Privacy Policy periodically to reflect technological or security enhancements. Material updates will be documented directly on this page with an updated effective date.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground font-mono">
        © {new Date().getFullYear()} LiveLeaf. Personal Document Workspace. All rights reserved.
      </footer>
    </div>
  );
}
