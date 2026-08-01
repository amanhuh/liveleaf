import type { Metadata } from "next";
import Link from "next/link";
import {
  GitHubSignInButton,
  GoogleSignInButton,
  AuthDivider,
  EmailSignUpForm,
} from "@/components/auth/auth-buttons";

export const metadata: Metadata = {
  title: "LiveLeaf — Create an account",
  description: "Create your personal LiveLeaf workspace.",
};

export default function SignUpPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground dark:text-white tracking-tight">
          Create an account
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 font-sans">
          Access your personal hub for clarity and focus
        </p>
      </div>

      <div className="space-y-3 pt-1">
        <GitHubSignInButton />
        <GoogleSignInButton />
      </div>

      <AuthDivider />

      <EmailSignUpForm />

      <p className="text-center text-xs text-muted-foreground dark:text-zinc-400 font-sans pt-1">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-foreground dark:text-white font-semibold underline-offset-4 hover:underline transition-all"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
