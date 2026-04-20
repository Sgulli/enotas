import {
	ArrowDown,
	ArrowUp,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Download,
	Filter,
	MoreVertical,
	ShoppingBag,
	Wallet,
} from "lucide-react";
import { useLoaderData } from "@tanstack/react-router";
import {
	Button,
	CardContent,
	CardHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui";
import { AdminStatCard, CuratorCard } from "#/components/admin/blocks";
import { PageHeader } from "../shared/PageHeader";
import { StatusBadge } from "../shared/StatusBadge";

const ORDER_STATUS_MAP: Record<string, "order-completed" | "order-pending" | "order-refunded"> = {
	pending: "order-pending",
	completed: "order-completed",
	refunded: "order-refunded",
	delivered: "order-completed",
	cancelled: "order-refunded",
};

const ORDER_STATUS_LABEL: Record<string, string> = {
	pending: "Pending",
	completed: "Completed",
	refunded: "Refunded",
	delivered: "Delivered",
	cancelled: "Cancelled",
};

export function OrdersPage() {
	const { orders, stats } = useLoaderData({ from: "/_admin/orders" });
	const formattedRevenue = Number(stats.totalRevenue).toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<div className="mx-auto max-w-6xl p-8">
			<PageHeader
				title="Orders Management"
				description="Review and manage orders."
				titleClassName="mb-2 text-3xl font-extrabold tracking-tight text-curator-primary"
				actions={
					<>
						<Button
							type="button"
							variant="outline"
							className="border-curator-outline-variant/30 bg-curator-surface-container-highest font-semibold text-curator-on-surface hover:bg-curator-surface-variant"
						>
							<Download />
							Export CSV
						</Button>
						<Button
							type="button"
							className="bg-gradient-to-br from-curator-primary to-curator-primary-container font-semibold text-curator-on-primary shadow-[0_4px_14px_0_rgba(0,30,64,0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,30,64,0.2)]"
						>
							<Filter />
							Filter
						</Button>
					</>
				}
			/>

			<div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
				<AdminStatCard
					label="Total Revenue"
					value={formattedRevenue}
					icon={<Wallet className="h-5 w-5" />}
					footer={
						<span className="flex items-center gap-1 font-medium text-curator-tertiary-fixed-dim">
							<ArrowUp className="h-3 w-3" />
							{stats.totalCount} total orders
						</span>
					}
				/>
				<AdminStatCard
					label="Pending Orders"
					value={String(stats.pendingCount)}
					icon={<ShoppingBag className="h-5 w-5" />}
					footer={
						<span className="flex items-center gap-1 text-curator-on-surface-variant">
							<CheckCircle className="h-3 w-3" />
							Awaiting fulfillment
						</span>
					}
				/>
				<AdminStatCard
					label="Total Orders"
					value={String(stats.totalCount)}
					icon={<ArrowDown className="h-5 w-5" />}
					iconClassName="rounded-lg bg-curator-error-container/50 p-2 text-curator-error"
					footer={
						<span className="flex items-center gap-1 text-curator-on-surface-variant">
							All time orders
						</span>
					}
				/>
			</div>

			<CuratorCard className="gap-0 overflow-hidden py-0">
				<CardHeader className="border-b border-curator-outline-variant/10 px-6 py-4">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-wrap gap-6">
							{["All Orders", "Pending", "Completed", "Refunded"].map(
								(tab, i) => (
									<button
										key={tab}
										type="button"
										className={
											i === 0
												? "border-b-2 border-curator-primary pb-2 text-sm font-bold text-curator-primary"
												: "border-b-2 border-transparent pb-2 text-sm font-medium text-curator-on-surface-variant transition hover:text-curator-primary"
										}
									>
										{tab}
									</button>
								),
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="px-0 pb-0 pt-0">
					<Table>
						<TableHeader>
							<TableRow className="border-curator-outline-variant/10 bg-curator-surface hover:bg-curator-surface">
								<TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-curator-on-surface-variant">
									Order ID
								</TableHead>
								<TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-curator-on-surface-variant">
									Customer
								</TableHead>
								<TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-curator-on-surface-variant">
									Date
								</TableHead>
								<TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-curator-on-surface-variant">
									Amount
								</TableHead>
								<TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-curator-on-surface-variant">
									Status
								</TableHead>
								<TableHead className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-curator-on-surface-variant">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="text-sm">
							{orders.map((order) => (
								<TableRow
									key={order.id}
									className="group border-curator-outline-variant/10 hover:bg-curator-surface-container-low"
								>
									<TableCell className="px-6 py-5 font-medium text-curator-primary">
										#{order.id.slice(0, 8)}
									</TableCell>
									<TableCell className="px-6 py-5">
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-curator-primary-fixed text-xs font-bold text-curator-primary-fixed-dim">
												{order.user?.name
													?.split(" ")
													.map((p) => p[0])
													.join("") ?? "?"}
											</div>
											<div>
												<div className="font-semibold text-curator-on-surface">
													{order.user?.name ?? "Unknown"}
												</div>
												<div className="text-xs text-curator-on-surface-variant">
													{order.user?.email ?? ""}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell className="px-6 py-5 text-curator-on-surface-variant">
										{new Date(order.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell className="px-6 py-5 font-semibold text-curator-primary">
										${Number(order.total).toFixed(2)}
									</TableCell>
									<TableCell className="px-6 py-5">
										<StatusBadge
											variant={ORDER_STATUS_MAP[order.status] ?? "order-pending"}
											label={ORDER_STATUS_LABEL[order.status] ?? order.status}
										/>
									</TableCell>
									<TableCell className="px-6 py-5 text-right">
										<div className="flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												className="text-curator-on-surface-variant hover:text-curator-primary"
											>
												<MoreVertical className="h-5 w-5" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
				<div className="flex items-center justify-between border-t border-curator-outline-variant/10 bg-curator-surface-container-lowest px-4 py-4">
					<span className="text-xs font-medium text-curator-on-surface-variant">
						Showing {orders.length} of {stats.totalCount} orders
					</span>
					<div className="flex gap-1">
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							disabled
							className="text-curator-on-surface-variant"
						>
							<ChevronLeft />
						</Button>
						<Button
							type="button"
							size="sm"
							className="h-6 min-w-6 rounded bg-curator-primary px-0 text-xs font-bold text-curator-on-primary"
						>
							1
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							className="text-curator-on-surface-variant hover:bg-curator-surface-container-low hover:text-curator-primary"
						>
							<ChevronRight />
						</Button>
					</div>
				</div>
			</CuratorCard>
		</div>
	);
}