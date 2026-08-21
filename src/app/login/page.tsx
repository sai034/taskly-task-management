"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Skeleton";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { user, ready, loginAsGuest, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<null | "guest" | "google">(null);

  useEffect(() => {
    if (ready && user) router.replace("/tasks");
  }, [ready, user, router]);

  const handleGuest = async () => {
    setLoading("guest");
    try {
      await loginAsGuest();
    } finally {
      setLoading(null);
    }
  };

  const handleGoogle = async () => {
    setLoading("google");
    try {
      await loginWithGoogle();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app px-4">
      <div className="w-full max-w-[380px]">
        {/* Brand mark */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-solid text-solid-fg">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Taskly</span>
        </div>

        <div className="rounded-2xl border border-border-default bg-surface p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold tracking-tight">
              Let&apos;s get back on track
            </h1>
            <p className="mt-1.5 text-[13px] text-muted">
              Enter your email below to login to your account.
            </p>
          </div>

          <div className="space-y-2.5">
            <Button
              variant="solid"
              className="h-11 w-full text-sm"
              onClick={handleGuest}
              disabled={loading !== null}
            >
              {loading === "guest" ? <Spinner /> : "Continue as Guest"}
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full gap-2.5 text-sm"
              onClick={handleGoogle}
              disabled={loading !== null}
            >
              {loading === "google" ? (
                <Spinner />
              ) : (
                <>
                  <GoogleIcon />
                  Login with Google
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-[280px] text-center text-[12px] leading-relaxed text-faint">
          By clicking continue, you agree to our{" "}
          <a className="text-muted underline underline-offset-2 hover:text-text">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="text-muted underline underline-offset-2 hover:text-text">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
