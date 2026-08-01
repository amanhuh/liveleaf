import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — LiveLeaf",
  description: "Comprehensive Terms of Service for LiveLeaf personal document workspace.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: August 1, 2026 · Version 1.0
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and LiveLeaf ("LiveLeaf", "we", "us", or "our") governing your access to and use of the LiveLeaf web application, document editor, APIs, and associated services (collectively, the "Service").
            </p>
            <p>
              By signing in, creating an account, or accessing the Service, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must immediately discontinue use of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">2. Workspace Scope & Single-User Model</h2>
            <p>
              LiveLeaf is intentionally architected as a distraction-free, single-user personal knowledge workspace. The Service is optimized for individual writing, research organization, and private note management.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs">
              <li>Accounts are strictly intended for individual personal use.</li>
              <li>Sharing login credentials or automated access to a single account across unauthorized third parties is prohibited.</li>
              <li>You are responsible for maintaining the confidentiality of your OAuth authentication tokens and account sessions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">3. User Content & Complete Data Ownership</h2>
            <p>
              You retain 100% intellectual property ownership of all documents, text, titles, code snippets, notes, and media ("User Content") created, edited, or stored within your LiveLeaf workspace.
            </p>
            <p>
              LiveLeaf claims zero ownership, license rights, or commercial exploitation rights over your User Content. We store and transmit your content solely for the purpose of rendering your editor canvas, persisting database state, executing instant full-text search queries, and syncing background autosave.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">4. Service Performance & Background Autosave</h2>
            <p>
              LiveLeaf incorporates real-time debounced autosave mechanisms to synchronize document edits automatically. While we engineer desktop-grade reliability, you acknowledge that web browser environments, network connectivity disruptions, or device unexpected power loss may impact unsaved transient states.
            </p>
            <p>
              We recommend utilizing LiveLeaf's built-in Markdown export features (`.md`) to maintain independent local backups of critical research.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">5. Acceptable Use Policy</h2>
            <p>You agree not to engage in any prohibited activities, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li>Attempting to probe, scan, or test the vulnerability of LiveLeaf API endpoints, PostgreSQL database infrastructure, or authentication layers.</li>
              <li>Using automated scraping, crawling, or denial-of-service tools against our servers.</li>
              <li>Uploading malicious code, scripts, or exploitative content intended to compromise system integrity.</li>
              <li>Using the Service for any unlawful or unauthorized commercial spam operations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">6. Account Termination & Data Export</h2>
            <p>
              You may terminate your LiveLeaf account at any time. Upon soft-deletion or permanent trash purge within the application settings, your documents will be removed from our active relational database tables.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, LiveLeaf and its maintainers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of your access to or inability to access the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">8. Governing Law & Modifications</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws without regard to conflict of law principles. We reserve the right to modify these Terms at any time. Continued use of the Service following published updates constitutes acceptance of modified terms.
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
