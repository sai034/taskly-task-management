import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/** Shared reading layout for the Terms & Privacy pages. */
export function LegalShell({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-app">
      <header className="sticky top-0 z-10 border-b border-border-default bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/login" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-solid text-solid-fg">
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-[14px] font-semibold tracking-tight">Taskly</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted hover:bg-hover hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[12px] font-medium uppercase tracking-wide text-accent">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-[13px] text-faint">Last updated: {updated}</p>
        <p className="mt-6 text-[15px] leading-relaxed text-muted">{intro}</p>

        <div className="mt-8 space-y-8">{children}</div>

        <div className="mt-12 rounded-xl border border-border-default bg-surface-2 px-4 py-3 text-[12px] leading-relaxed text-faint">
          Taskly is a portfolio/assessment demo application. This document is a plain-language
          template provided for completeness and is not legal advice.
        </div>
      </main>
    </div>
  );
}

/** A titled section within a legal document. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight">{heading}</h2>
      <div className="mt-2 space-y-3 text-[14px] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}
