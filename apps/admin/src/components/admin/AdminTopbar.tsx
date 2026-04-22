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
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between gap-3 border-b border-curator-outline-variant/10 bg-curator-surface-container-lowest/80 px-4 backdrop-blur-xl md:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="text-curator-on-surface hover:bg-curator-surface-container-low" />
        <p className="truncate text-xl font-bold tracking-tighter text-curator-primary">
          {appName}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-curator-on-surface-variant/60"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search…"
            className={cn(
              "h-9 w-56 appearance-none rounded-full border border-curator-outline-variant/20 bg-curator-surface-container-low/80 pl-10 text-sm text-curator-on-surface placeholder:text-curator-on-surface-variant/50",
              "focus-visible:border-curator-primary/40 focus-visible:ring-2 focus-visible:ring-curator-primary/15 focus-visible:ring-offset-0",
            )}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative rounded-full text-curator-on-surface-variant hover:bg-curator-surface-container hover:text-curator-on-surface"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-curator-tertiary" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full text-curator-on-surface-variant hover:bg-curator-surface-container hover:text-curator-on-surface"
          aria-label="Settings"
        >
          <Settings className="h-[18px] w-[18px]" />
        </Button>

        <div className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-curator-primary-fixed to-curator-primary-fixed-dim font-bold text-curator-primary text-xs ring-2 ring-curator-surface-container-lowest shadow-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}