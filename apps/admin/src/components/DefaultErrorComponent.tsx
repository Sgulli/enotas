import { Home, LogIn, TriangleAlert } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { isAuthError } from "#/lib/errors";

export function DefaultErrorComponent({ error, reset }: ErrorComponentProps) {
  if (isAuthError(error)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-curator-surface p-6">
        <div className="relative mx-auto flex max-w-md flex-col items-center gap-8 text-center">
          <div className="absolute -top-8 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-curator-primary-fixed-dim/30 blur-3xl" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-curator-surface-container-lowest shadow-lg ring-1 ring-curator-outline-variant">
            <LogIn className="h-12 w-12 text-curator-primary" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-curator-on-background">
              Session Expired
            </h1>
            <p className="text-base text-curator-on-surface-variant">
              Your session has expired. Please sign in again to continue.
            </p>
          </div>

          <Link
            to="/signin"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-curator-primary to-curator-primary-container px-5 py-2.5 text-sm font-semibold text-curator-on-primary shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-curator-surface p-6">
      <div className="relative mx-auto flex max-w-md flex-col items-center gap-8 text-center">
        <div className="absolute -top-8 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-curator-error-container/40 blur-3xl" />

        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-curator-surface-container-lowest shadow-lg ring-1 ring-curator-outline-variant">
          <TriangleAlert className="h-12 w-12 text-curator-error" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-curator-on-background">
            Oops!
          </h1>
          <p className="text-base text-curator-on-surface-variant">
            Something went wrong on our end. Please try again later.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-curator-primary px-5 py-2.5 text-sm font-semibold text-curator-on-primary shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Back to Homepage
          </Link>

          <button
            type="button"
            onClick={() => reset?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-curator-outline-variant bg-curator-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-curator-on-surface shadow-sm transition-all hover:bg-curator-surface-container active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
