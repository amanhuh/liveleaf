import type { Metadata } from "next";
import Link from "next/link";
import {
  GitHubSignInButton,
  GoogleSignInButton,
  AuthDivider,
  EmailSignUpForm,
} from "@/components/auth/auth-buttons";

export const metadata: Metadata = {
  title: "Sign up — Liveleaf",
  description: "Create your free Liveleaf account and start writing.",
};

export default function SignUpPage() {
  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1 className="auth-card-title">Create an account</h1>
        <p className="auth-card-subtitle">
          Join Liveleaf and write without friction
        </p>
      </div>

      <div className="auth-socials">
        <GitHubSignInButton />
        <GoogleSignInButton />
      </div>

      <AuthDivider />

      <EmailSignUpForm />

      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link href="/sign-in" className="auth-footer-link">
          Sign in
        </Link>
      </p>

      <p className="auth-tos">
        By continuing, you agree to our{" "}
        <a href="#" className="auth-footer-link">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="auth-footer-link">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
