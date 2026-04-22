import { Bell, Search, Settings } from "lucide-react";
import { Button, Input } from "@repo/ui";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { cn } from "@repo/ui/lib/utils";
import { useSession } from "#/lib/auth";
import { env } from "#/env";

export function AdminTopbar() {
  const { data: session } = useSession();
  const { VITE_APP_NAME: appName } = env;

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("") ?? "?";

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between gap-3 border-b border-curator-outline-variant/10 bg-white/80 px-4 backdrop-blur-xl md:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="text-curator-on-surface hover:bg-curator-surface-container-low" />
        <p className="truncate text-xl font-bold tracking-tighter text-blue-900">
          {appName}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-curator-on-surface-variant"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search…"
            className={cn(
              "h-9 w-56 appearance-none rounded-full border border-curator-outline-variant/25 bg-curator-surface-container-low pl-10 text-sm text-curator-on-surface placeholder:text-curator-on-surface-variant",
              "focus-visible:border-curator-primary/45 focus-visible:ring-curator-primary/25",
            )}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative rounded-full text-slate-500 hover:bg-slate-100/80"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-curator-tertiary-fixed-dim" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:bg-slate-100/80"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <div className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-curator-primary-fixed font-bold text-curator-primary-fixed-dim text-xs">
          {initials}
        </div>
      </div>
    </header>
  );
}
