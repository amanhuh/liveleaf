import type { Metadata } from "next";
import Link from "next/link";
import {
  GitHubSignInButton,
  GoogleSignInButton,
  AuthDivider,
  EmailSignUpForm,
} from "@/components/auth/auth-buttons";

export const metadata: Metadata = {
  title: "Sign up — LiveLeaf",
  description: "Create your free LiveLeaf account and start writing.",
};

export default function SignUpPage() {
  return (
    <div className="space-y-3 max-w-[310px] mx-auto w-full">
      {/* Header */}
      <div className="space-y-0.5 text-center md:text-left">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-xs text-muted-foreground font-sans">
          Access your personal hub for clarity and focus
        </p>
      </div>

      <div className="space-y-2 pt-1">
        <GitHubSignInButton />
        <GoogleSignInButton />
      </div>

      <AuthDivider />

      <EmailSignUpForm />

      <p className="text-center text-xs text-muted-foreground pt-0.5">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground hover:underline underline-offset-4">
          Log in
        </Link>
      </p>
    </div>
  );
}
