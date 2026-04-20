import { Link, useRouterState } from "@tanstack/react-router";
import { useSession } from "#/lib/auth";
import type { LucideIcon } from "lucide-react";
import {
	BookOpen,
	ChevronRight,
	ChevronsUpDown,
	FolderTree,
	LayoutDashboard,
	Library,
	Receipt,
	ShoppingCart,
	Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@repo/ui";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@repo/ui/components/sidebar";

type NavItem = {
	to: string;
	label: string;
	icon: LucideIcon;
	end?: boolean;
};

const PLATFORM_NAV: NavItem[] = [
	{ to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
	{ to: "/users", label: "Users", icon: Users },
];

const CATALOG_NAV: NavItem[] = [
	{ to: "/products", label: "Products", icon: BookOpen },
	{ to: "/categories", label: "Categories", icon: FolderTree },
	{ to: "/orders", label: "Orders", icon: Receipt },
	{ to: "/carts", label: "Carts", icon: ShoppingCart },
	{ to: "/library", label: "Library", icon: Library },
];

function navActive(pathname: string, to: string, end?: boolean) {
	if (end) return pathname === to || pathname === `${to}/`;
	if (to === "/products") {
		return pathname === to || pathname.startsWith(`${to}/`);
	}
	return pathname === to;
}

function NavGroup({
	title,
	items,
	pathname,
}: Readonly<{
	title: string;
	items: NavItem[];
	pathname: string;
}>) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{title}</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map(({ to, label, icon: Icon, end }) => {
						const active = navActive(pathname, to, end);
						return (
							<SidebarMenuItem key={to}>
								<SidebarMenuButton
									asChild
									isActive={active}
									tooltip={label}
									className={
										active
											? "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground"
											: undefined
									}
								>
									<Link to={to} className="gap-2">
										<Icon className="shrink-0" strokeWidth={active ? 2.25 : 2} />
										<span className="flex-1 truncate">{label}</span>
										<ChevronRight className="ml-auto size-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

export function AdminSidebar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { data: session } = useSession();

	const name = session?.user?.name ?? "Admin";
	const email = session?.user?.email ?? "";
	

	const getInitals = (name?: string) => {
		if (!name) return "?";
		return name
			.split(" ")
			.filter(Boolean)
			.map((p) => p[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() ;
	};

	return (
		<Sidebar collapsible="icon" className="border-r border-sidebar-border">
			<SidebarHeader className="gap-2 border-b border-sidebar-border/60 p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild tooltip="Library Admin">
							<Link to="/">
								<div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Library className="size-4" aria-hidden />
								</div>
								<div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
									<span className="truncate font-semibold text-sidebar-foreground">
										Library Admin
									</span>
									<span className="truncate text-xs text-sidebar-foreground/70">
										Academic Curator
									</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-70 group-data-[collapsible=icon]:hidden" />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavGroup title="Platform" items={PLATFORM_NAV} pathname={pathname} />
				<SidebarSeparator className="mx-2" />
				<NavGroup title="Catalog" items={CATALOG_NAV} pathname={pathname} />
			</SidebarContent>

			<SidebarFooter className="border-t border-sidebar-border/60 p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" tooltip={name}>
							<Avatar className="size-8">
								<AvatarFallback className="bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
									{getInitals(name)}
								</AvatarFallback>
							</Avatar>
							<div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
								<span className="truncate font-medium">{name}</span>
								<span className="truncate text-xs text-sidebar-foreground/70">
									{email || "—"}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-70 group-data-[collapsible=icon]:hidden" />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
