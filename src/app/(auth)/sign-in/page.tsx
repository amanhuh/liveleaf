import type { Metadata } from "next";
import Link from "next/link";
import {
  GitHubSignInButton,
  GoogleSignInButton,
  AuthDivider,
  EmailSignInForm,
} from "@/components/auth/auth-buttons";

export const metadata: Metadata = {
  title: "Sign in — LiveLeaf",
  description: "Sign in to your LiveLeaf personal workspace.",
};

export default function SignInPage() {
  return (
    <div className="space-y-3 max-w-[310px] mx-auto w-full">
      {/* Header */}
      <div className="space-y-0.5 text-center md:text-left">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          Welcome Back!
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Sign in to access your personal workspace
        </p>
      </div>

      <div className="space-y-2 pt-1">
        <GitHubSignInButton />
        <GoogleSignInButton />
      </div>

      <AuthDivider />

      <EmailSignInForm />

      <p className="text-center text-xs text-muted-foreground pt-0.5">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-foreground hover:underline underline-offset-4">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
