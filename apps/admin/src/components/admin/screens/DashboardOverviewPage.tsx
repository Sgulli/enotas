import {
	Library,
	Minus,
	ShoppingBag,
	TrendingUp,
	Users,
} from "lucide-react";
import { useLoaderData } from "@tanstack/react-router";
import { PageHeader } from "../shared/PageHeader";

export function DashboardOverviewPage() {
	const { stats } = useLoaderData({ from: "/_admin/" });

	const formattedRevenue = Number(stats.totalRevenue).toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<div className="mx-auto w-full max-w-7xl p-8">
			<PageHeader
				title="Admin Overview"
				description="Metrics and insights for your store."
				titleClassName="mb-2 text-3xl font-bold tracking-tight text-curator-on-background"
				className="mb-10"
			/>

			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
				{/* Revenue Card — Hero */}
				<div
					className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-curator-primary to-curator-primary-container p-6 text-curator-on-primary shadow-[0_40px_60px_-15px_rgba(0,30,64,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_50px_70px_-15px_rgba(0,30,64,0.18)]"
					style={{ animationDelay: "0ms" }}
				>
					<div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-white opacity-[0.07] blur-3xl transition-all duration-500 group-hover:opacity-[0.12]" />
					<div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-curator-primary-fixed-dim opacity-[0.05] blur-3xl" />
					<div className="relative z-10 mb-4 flex items-start justify-between">
						<div>
							<p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-curator-primary-fixed-dim/80">
								Total Revenue
							</p>
							<h3 className="text-4xl font-bold tracking-tighter tabular-nums">
								{formattedRevenue}
							</h3>
						</div>
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105">
							<Library className="h-5 w-5 text-curator-primary-fixed-dim" />
						</div>
					</div>
					<div className="relative z-10 flex items-center gap-1.5 text-sm font-medium text-curator-primary-fixed-dim/90">
						<span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15">
							<TrendingUp className="h-3 w-3 text-emerald-300" />
						</span>
						Live data
					</div>
				</div>

				{/* Users Card */}
				<div className="group relative overflow-hidden rounded-xl border border-curator-outline-variant/10 bg-curator-surface-container-lowest p-6 shadow-[0_20px_40px_-15px_rgba(0,30,64,0.04)] ring-1 ring-curator-outline-variant/[0.07] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_50px_-15px_rgba(0,30,64,0.08)]">
					<div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-curator-primary/5 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />
					<div className="relative z-10 mb-4 flex items-start justify-between">
						<div>
							<p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-curator-on-surface-variant/80">
								Total Users
							</p>
							<h3 className="text-3xl font-bold tracking-tighter text-curator-on-background tabular-nums">
								{stats.userCount.toLocaleString()}
							</h3>
						</div>
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-curator-primary/8 text-curator-primary ring-1 ring-curator-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-curator-primary/12">
							<Users className="h-5 w-5" />
						</div>
					</div>
					<div className="relative z-10 flex items-center gap-1.5 text-sm font-medium text-curator-on-surface-variant/80">
						<span className="flex h-5 w-5 items-center justify-center rounded-full bg-curator-surface-container">
							<Minus className="h-3 w-3 text-curator-tertiary-fixed-dim" />
						</span>
						Registered accounts
					</div>
				</div>

				{/* Orders Card */}
				<div className="group relative overflow-hidden rounded-xl border border-curator-outline-variant/10 bg-curator-surface-container-lowest p-6 shadow-[0_20px_40px_-15px_rgba(0,30,64,0.04)] ring-1 ring-curator-outline-variant/[0.07] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_50px_-15px_rgba(0,30,64,0.08)]">
					<div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-curator-tertiary/5 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />
					<div className="relative z-10 mb-4 flex items-start justify-between">
						<div>
							<p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-curator-on-surface-variant/80">
								Total Orders
							</p>
							<h3 className="text-3xl font-bold tracking-tighter text-curator-on-background tabular-nums">
								{stats.orderCount.toLocaleString()}
							</h3>
						</div>
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-curator-tertiary/8 text-curator-tertiary ring-1 ring-curator-tertiary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-curator-tertiary/12">
							<ShoppingBag className="h-5 w-5" />
						</div>
					</div>
					<div className="relative z-10 flex items-center gap-1.5 text-sm font-medium text-curator-on-surface-variant/80">
						<span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
							<TrendingUp className="h-3 w-3 text-emerald-600" />
						</span>
						Products: {stats.productCount.toLocaleString()}
					</div>
				</div>
			</div>
		</div>
	);
}