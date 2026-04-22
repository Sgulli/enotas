import { Outlet, useNavigate } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { AdminSidebar } from "../AdminSidebar";
import { AdminTopbar } from "../AdminTopbar";
import { useSession } from "#/lib/auth";
import { useEffect } from "react";

export function AdminLayout() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      navigate({
        to: "/signin",
        search: { redirect: globalThis.location.href },
        replace: true,
      });
    }
  }, [session, isPending, navigate]);

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider className="h-[100dvh] min-h-0 font-curator antialiased">
        <AdminSidebar />
        <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-curator-surface text-curator-on-surface md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none">
          <AdminTopbar />
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-none">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
