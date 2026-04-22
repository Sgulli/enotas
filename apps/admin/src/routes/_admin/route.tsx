import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { getSession } from "#/server/auth";
import { AdminSidebar } from "#/components/admin/AdminSidebar";
import { AdminTopbar } from "#/components/admin/AdminTopbar";
import { isAuthError } from "#/lib/errors";
import { useSession } from "#/lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/_admin")({
	beforeLoad: async ({ location }) => {
		const session = await getSession();
		if (!session) {
			throw redirect({
				to: "/signin",
				search: { redirect: location.href },
			});
		}
		return { user: session.user };
	},
	onError: ({ error }) => {
		if (isAuthError(error)) {
			throw redirect({
				to: "/signin",
				search: { redirect: globalThis.location.href },
			});
		}
	},
	component: AdminLayout,
});

function AdminLayout() {
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