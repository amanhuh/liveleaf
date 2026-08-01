import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "LiveLeaf — Sign in",
  description: "Sign in or create an account to start writing with LiveLeaf.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f4f5f8] dark:bg-[#090a0c] text-foreground dark:text-zinc-100 p-3 sm:p-5 md:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 select-none font-sans transition-colors duration-200">
      {/* Left Signature Emerald Artwork Panel */}
      <div className="hidden md:flex md:w-1/2 h-full rounded-[28px] bg-[#06140b] p-8 lg:p-12 flex-col justify-between text-white relative overflow-hidden shrink-0 border border-emerald-950/60 shadow-2xl">
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-[#06140b] to-[#020804] z-0"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white font-sans text-base font-bold tracking-tight hover:opacity-90 transition-opacity"
          >
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span>LiveLeaf</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-emerald-200/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-3 mt-auto max-w-md">
          <h2 className="font-serif text-3xl lg:text-5xl font-normal leading-[1.12] text-emerald-50 tracking-tight">
            Where <br />
            Knowledge <br />
            Comes <span className="italic font-normal">Alive.</span>
          </h2>
          <p className="text-xs lg:text-sm text-emerald-200/60 leading-relaxed font-sans">
            A peaceful writing sanctuary for deep focus, structured thoughts, and rapid search.
          </p>
        </div>
      </div>

      {/* Right Theme-Responsive Form Container */}
      <div className="flex-1 md:w-1/2 h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-transparent overflow-hidden">
        <div className="md:hidden flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-sans font-bold text-base text-foreground"
          >
            <Leaf className="w-4 h-4 text-primary" />
            <span>LiveLeaf</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
        </div>

        <div className="w-full my-auto max-w-sm mx-auto">{children}</div>
      </div>
    </div>
  );
}
