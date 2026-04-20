import { AlertTriangle, Monitor, TrendingUp } from "lucide-react";
import { useLoaderData } from "@tanstack/react-router";
import { Button } from "@repo/ui";
import { PageHeader } from "../shared/PageHeader";

export function ActiveCartsPage() {
	const { carts, stats } = useLoaderData({ from: "/_admin/carts" });
	const topCart = carts[0];

	return (
		<div className="mx-auto max-w-7xl p-8 lg:p-12">
			<PageHeader
				title="Live Cart Monitoring"
				description="Real-time insight into active carts."
				titleClassName="mb-2 text-3xl font-semibold tracking-tight text-curator-primary md:text-4xl"
				className="mb-12"
			/>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="space-y-8 lg:col-span-2">
					{topCart && (
						<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-curator-primary to-curator-primary-container p-8 text-curator-on-primary shadow-[0_20px_40px_-15px_rgba(0,30,64,0.3)]">
							<div className="relative z-10">
								<div className="mb-6 flex items-start justify-between">
									<div>
										<span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-curator-primary-fixed-dim">
											Highest Value Cart Active
										</span>
										<h3 className="text-2xl font-bold tracking-tight">
											Cart #{topCart.id.slice(0, 8)}
										</h3>
									</div>
									<div className="text-right text-3xl font-light">
										${topCart.totalValue}
									</div>
								</div>
								<div className="mb-6 space-y-3">
									<div className="flex justify-between border-b border-white/10 pb-2 text-sm">
										<span className="text-curator-primary-fixed-dim">
											User
										</span>
										<span className="font-medium">
											{topCart.user?.name ?? "Guest"}
										</span>
									</div>
									<div className="flex justify-between border-b border-white/10 pb-2 text-sm">
										<span className="text-curator-primary-fixed-dim">Items</span>
										<span className="font-medium">
											{topCart.items.length} item{topCart.items.length !== 1 ? "s" : ""}
										</span>
									</div>
									<div className="flex justify-between pb-2 text-sm">
										<span className="text-curator-primary-fixed-dim">
											Last Updated
										</span>
										<span className="font-medium">
											{new Date(topCart.updatedAt).toLocaleString()}
										</span>
									</div>
								</div>
								<Button
									type="button"
									className="w-full rounded-md bg-curator-surface-container-lowest px-4 py-2 text-sm font-semibold text-curator-primary transition hover:bg-curator-surface sm:w-auto"
								>
									View Details
								</Button>
							</div>
							<div className="absolute -right-[10%] top-[-50%] h-64 w-64 rounded-full bg-white opacity-5 blur-3xl" />
						</div>
					)}

					<div className="rounded-xl bg-curator-surface-container-lowest p-6 shadow-sm">
						<div className="mb-6 flex items-center justify-between">
							<h3 className="text-lg font-semibold text-curator-primary">
								Current Active Carts
							</h3>
							<span className="flex items-center gap-1 rounded-full bg-curator-surface-container px-3 py-1 text-xs font-medium text-curator-on-surface-variant">
								<span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
								Live Sync
							</span>
						</div>
						<div className="mb-4 grid grid-cols-12 gap-4 px-2 text-xs font-semibold uppercase tracking-widest text-curator-on-surface-variant">
							<div className="col-span-2">Cart ID</div>
							<div className="col-span-3">User</div>
							<div className="col-span-5">Items</div>
							<div className="col-span-2 text-right">Value</div>
						</div>
						<div className="space-y-2">
							{carts.map((cart) => (
								<div
									key={cart.id}
									className="grid grid-cols-12 items-center gap-4 rounded-lg p-3 transition hover:bg-curator-surface-container-low"
								>
									<div className="col-span-2 text-sm font-medium text-curator-primary">
										#{cart.id.slice(0, 8)}
									</div>
									<div className="col-span-3 flex items-center gap-2 text-sm text-curator-on-surface">
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-curator-primary-fixed text-xs font-bold text-curator-primary-fixed-dim">
											{cart.user?.name
												?.split(" ")
												.map((p) => p[0])
												.join("") ?? "?"}
										</div>
										<span className="truncate">
											{cart.user?.name ?? "Guest"}
										</span>
									</div>
									<div className="col-span-5 truncate text-sm text-curator-secondary">
										{cart.items.map((i) => i.product.name).join(", ") || "Empty"}
									</div>
									<div className="col-span-2 text-right text-sm font-medium text-curator-on-surface">
										${cart.totalValue}
									</div>
								</div>
							))}
							{carts.length === 0 && (
								<div className="py-8 text-center text-sm text-curator-on-surface-variant">
									No active carts
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-8">
					<div className="flex min-h-[140px] flex-col justify-between rounded-xl border-l-4 border-l-curator-primary bg-curator-surface-container-lowest p-6 shadow-sm">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-sm font-semibold uppercase tracking-wide text-curator-on-surface-variant">
								Total Active Value
							</span>
							<span className="text-lg text-curator-secondary">$</span>
						</div>
						<div>
							<div className="text-4xl font-light tracking-tight text-curator-primary">
								${stats.totalActiveValue}
							</div>
							<div className="mt-2 flex items-center gap-1 text-xs text-curator-secondary">
								<TrendingUp className="h-3.5 w-3.5 text-curator-primary-container" />
								{stats.cartCount} active carts
							</div>
						</div>
					</div>

					<div className="flex min-h-[140px] flex-col justify-between rounded-xl bg-curator-surface-container-lowest p-6 shadow-sm">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-sm font-semibold uppercase tracking-wide text-curator-on-surface-variant">
								Active Carts
							</span>
							<Monitor className="text-lg text-curator-secondary" />
						</div>
						<div>
							<div className="text-4xl font-light tracking-tight text-curator-primary">
								{stats.cartCount}
							</div>
							<p className="mt-2 text-xs text-curator-secondary">
								{carts.reduce((sum, c) => sum + c.items.length, 0)} total items
							</p>
						</div>
					</div>

					{carts.length > 0 && (
						<div className="rounded-xl bg-curator-tertiary-fixed p-6 text-curator-on-tertiary-fixed">
							<div className="flex items-start gap-4">
								<AlertTriangle className="mt-1 h-5 w-5 text-curator-tertiary" />
								<div>
									<h4 className="mb-1 text-sm font-semibold uppercase tracking-wider">
										Cart Activity
									</h4>
									<p className="text-sm leading-relaxed opacity-90">
										{carts.length} cart{carts.length !== 1 ? "s" : ""} currently
										active with a combined value of ${stats.totalActiveValue}.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}