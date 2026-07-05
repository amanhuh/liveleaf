import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Liveleaf — Sign in",
  description: "Sign in or create an account to start writing with Liveleaf.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      {/* ── Left decorative panel ── */}
      <div className="auth-panel" aria-hidden="true">
        <div className="auth-panel-content">
          <div className="auth-brand">
            <Leaf className="auth-brand-icon" />
            <span className="auth-brand-name">Liveleaf</span>
          </div>

          <blockquote className="auth-quote">
            <p>
              "The best writing happens when ideas flow freely — without the
              friction of formatting."
            </p>
            <footer>— The Liveleaf team</footer>
          </blockquote>

          {/* Decorative floating cards */}
          <div className="auth-deco-cards">
            <div className="auth-deco-card auth-deco-card-1">
              <div className="auth-deco-bar" style={{ width: "80%" }} />
              <div className="auth-deco-bar" style={{ width: "60%" }} />
              <div className="auth-deco-bar" style={{ width: "70%" }} />
            </div>
            <div className="auth-deco-card auth-deco-card-2">
              <div className="auth-deco-bar" style={{ width: "55%" }} />
              <div className="auth-deco-bar" style={{ width: "75%" }} />
            </div>
          </div>
        </div>

        {/* Gradient orbs */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {/* Mobile-only brand */}
          <Link href="/" className="auth-mobile-brand">
            <Leaf className="size-5" />
            <span className="font-semibold">Liveleaf</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
