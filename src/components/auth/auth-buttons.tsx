"use client";

import { useTransition, Suspense, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function SocialAuthGroupInner() {
  const [activeProvider, setActiveProvider] = useState<"github" | "google" | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/d";

  function handleOAuth(provider: "github" | "google") {
    if (activeProvider || isPending) return;
    setActiveProvider(provider);

    startTransition(async () => {
      try {
        const { error } = await authClient.signIn.social({
          provider,
          callbackURL: next,
        });
        if (error) {
          toast.error(
            error.message ?? `${provider === "github" ? "GitHub" : "Google"} sign-in failed. Try again.`
          );
          setActiveProvider(null);
        } else {
          router.refresh();
        }
      } catch {
        toast.error("Authentication error.");
        setActiveProvider(null);
      }
    });
  }

  const isLocked = activeProvider !== null || isPending;

  return (
    <div className="space-y-3 pt-1">
      <button
        id="github-signin-btn"
        onClick={() => handleOAuth("github")}
        disabled={isLocked}
        className={cn(
          "flex items-center justify-center gap-2.5 w-full h-11 px-4 rounded-full bg-foreground text-background font-medium text-xs sm:text-sm transition-all shadow-md",
          activeProvider === "github"
            ? "opacity-90 cursor-wait"
            : isLocked
            ? "opacity-40 cursor-not-allowed"
            : "hover:opacity-90 cursor-pointer"
        )}
      >
        {activeProvider === "github" ? (
          <Loader2 className="size-4 animate-spin text-background" />
        ) : (
          <GitHubIcon />
        )}
        <span>{activeProvider === "github" ? "Redirecting to GitHub..." : "Continue with GitHub"}</span>
      </button>

      <button
        id="google-signin-btn"
        onClick={() => handleOAuth("google")}
        disabled={isLocked}
        className={cn(
          "flex items-center justify-center gap-2.5 w-full h-11 px-4 rounded-full bg-card dark:bg-zinc-900 text-foreground dark:text-zinc-200 font-medium text-xs sm:text-sm transition-all border border-border/80 dark:border-zinc-700/80 shadow-2xs",
          activeProvider === "google"
            ? "opacity-90 cursor-wait"
            : isLocked
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-muted dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
        )}
      >
        {activeProvider === "google" ? (
          <Loader2 className="size-4 animate-spin text-foreground" />
        ) : (
          <GoogleIcon />
        )}
        <span>{activeProvider === "google" ? "Redirecting to Google..." : "Continue with Google"}</span>
      </button>
    </div>
  );
}

export function SocialAuthGroup() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3 pt-1">
          <button
            className="flex items-center justify-center gap-2.5 w-full h-11 px-4 rounded-full bg-foreground text-background font-medium text-xs sm:text-sm opacity-75 cursor-not-allowed"
            disabled
          >
            <Loader2 className="size-4 animate-spin text-background" />
            <span>Continue with GitHub</span>
          </button>
          <button
            className="flex items-center justify-center gap-2.5 w-full h-11 px-4 rounded-full bg-card dark:bg-zinc-900 text-foreground dark:text-zinc-200 font-medium text-xs sm:text-sm opacity-75 cursor-not-allowed border border-border/80 dark:border-zinc-700/80"
            disabled
          >
            <Loader2 className="size-4 animate-spin text-foreground" />
            <span>Continue with Google</span>
          </button>
        </div>
      }
    >
      <SocialAuthGroupInner />
    </Suspense>
  );
}

export function GitHubSignInButton() {
  return <SocialAuthGroup />;
}

export function GoogleSignInButton() {
  return null;
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-[1px] bg-border/70 dark:bg-zinc-800" />
      <span className="text-[10px] text-muted-foreground/70 dark:text-zinc-500 font-mono uppercase tracking-wider">
        or
      </span>
      <div className="flex-1 h-[1px] bg-border/70 dark:bg-zinc-800" />
    </div>
  );
}

export function EmailSignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-3 opacity-60 pointer-events-none" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-1">
        <label htmlFor="signin-email" className="text-xs font-medium text-foreground dark:text-zinc-300 pl-1">
          Email
        </label>
        <input
          id="signin-email"
          type="email"
          disabled
          autoComplete="email"
          placeholder="name@example.com"
          className="w-full h-10 px-3.5 rounded-xl bg-muted/50 dark:bg-zinc-900/80 border border-border/70 dark:border-zinc-700/80 text-foreground dark:text-zinc-100 text-xs placeholder:text-muted-foreground/50 dark:placeholder:text-zinc-500 cursor-not-allowed"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between pl-1">
          <label htmlFor="signin-password" className="text-xs font-medium text-foreground dark:text-zinc-300">
            Password
          </label>
        </div>
        <div className="relative">
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            disabled
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full h-10 pl-3.5 pr-10 rounded-xl bg-muted/50 dark:bg-zinc-900/80 border border-border/70 dark:border-zinc-700/80 text-foreground dark:text-zinc-100 text-xs placeholder:text-muted-foreground/50 dark:placeholder:text-zinc-500 cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 dark:text-zinc-500 p-1"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled
        className="w-full h-10 rounded-full bg-muted/40 dark:bg-zinc-900/40 text-muted-foreground/60 dark:text-zinc-500 font-medium text-xs border border-border/40 dark:border-zinc-800/40 cursor-not-allowed select-none shadow-none"
      >
        Sign in (Email disabled)
      </button>
    </form>
  );
}

export function EmailSignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-2.5 opacity-60 pointer-events-none" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-1">
        <label htmlFor="signup-name" className="text-xs font-medium text-foreground dark:text-zinc-300 pl-1">
          Your Name
        </label>
        <input
          id="signup-name"
          type="text"
          disabled
          autoComplete="name"
          placeholder="Aman Gupta"
          className="w-full h-9 px-3.5 rounded-xl bg-muted/50 dark:bg-zinc-900/80 border border-border/70 dark:border-zinc-700/80 text-foreground dark:text-zinc-100 text-xs placeholder:text-muted-foreground/50 dark:placeholder:text-zinc-500 cursor-not-allowed"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="signup-email" className="text-xs font-medium text-foreground dark:text-zinc-300 pl-1">
          Your Email
        </label>
        <input
          id="signup-email"
          type="email"
          disabled
          autoComplete="email"
          placeholder="name@example.com"
          className="w-full h-9 px-3.5 rounded-xl bg-muted/50 dark:bg-zinc-900/80 border border-border/70 dark:border-zinc-700/80 text-foreground dark:text-zinc-100 text-xs placeholder:text-muted-foreground/50 dark:placeholder:text-zinc-500 cursor-not-allowed"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="signup-password" className="text-xs font-medium text-foreground dark:text-zinc-300 pl-1">
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            disabled
            autoComplete="new-password"
            placeholder="Create password"
            className="w-full h-9 pl-3.5 pr-10 rounded-xl bg-muted/50 dark:bg-zinc-900/80 border border-border/70 dark:border-zinc-700/80 text-foreground dark:text-zinc-100 text-xs placeholder:text-muted-foreground/50 dark:placeholder:text-zinc-500 cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 dark:text-zinc-500 p-1"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled
        className="w-full h-10 rounded-full bg-muted/40 dark:bg-zinc-900/40 text-muted-foreground/60 dark:text-zinc-500 font-medium text-xs border border-border/40 dark:border-zinc-800/40 cursor-not-allowed select-none shadow-none"
      >
        Sign Up (Email disabled)
      </button>
    </form>
  );
}
