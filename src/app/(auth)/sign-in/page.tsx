import type { Metadata } from "next";
import Link from "next/link";
import {
  GitHubSignInButton,
  GoogleSignInButton,
  AuthDivider,
  EmailSignInForm,
} from "@/components/auth/auth-buttons";

export const metadata: Metadata = {
  title: "Sign in — Liveleaf",
  description: "Sign in to your Liveleaf account.",
};

export default function SignInPage() {
  return (
    <div className="auth-card">
      {/* Header */}
      <div className="auth-card-header">
        <h1 className="auth-card-title">Welcome back</h1>
        <p className="auth-card-subtitle">
          Sign in to continue writing with Liveleaf
        </p>
      </div>

      <div className="auth-socials">
        <GitHubSignInButton />
        <GoogleSignInButton />
      </div>

      <AuthDivider />

      <EmailSignInForm />

      <p className="auth-footer-text">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="auth-footer-link">
          Sign up
        </Link>
      </p>
    </div>
  );
}
