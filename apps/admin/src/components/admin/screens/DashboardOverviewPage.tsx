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
				<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-curator-primary to-curator-primary-container p-6 text-curator-on-primary shadow-[0_40px_60px_-15px_rgba(0,30,64,0.06)]">
					<div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white opacity-5 blur-2xl" />
					<div className="relative z-10 mb-4 flex items-start justify-between">
						<div>
							<p className="mb-1 text-sm font-medium uppercase tracking-wider text-curator-primary-fixed-dim">
								Total Revenue
							</p>
							<h3 className="text-4xl font-bold tracking-tighter">
								{formattedRevenue}
							</h3>
						</div>
						<Library className="h-8 w-8 text-curator-primary-fixed-dim" />
					</div>
					<div className="relative z-10 flex items-center text-sm font-medium text-curator-primary-fixed-dim">
						<TrendingUp className="mr-1 h-4 w-4" />
						Live data
					</div>
				</div>

				<div className="flex flex-col justify-between rounded-xl bg-curator-surface-container-lowest p-6 shadow-sm">
					<div className="mb-4 flex items-start justify-between">
						<div>
							<p className="mb-1 text-sm font-medium uppercase tracking-wider text-curator-on-surface-variant">
								Total Users
							</p>
							<h3 className="text-3xl font-bold tracking-tighter text-curator-on-background">
								{stats.userCount.toLocaleString()}
							</h3>
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-curator-surface-container text-curator-primary">
							<Users className="h-5 w-5" />
						</div>
					</div>
					<div className="flex items-center text-sm font-medium text-curator-on-surface-variant">
						<Minus className="mr-1 h-4 w-4 text-curator-tertiary-fixed-dim" />
						Registered accounts
					</div>
				</div>

				<div className="flex flex-col justify-between rounded-xl bg-curator-surface-container-lowest p-6 shadow-sm">
					<div className="mb-4 flex items-start justify-between">
						<div>
							<p className="mb-1 text-sm font-medium uppercase tracking-wider text-curator-on-surface-variant">
								Total Orders
							</p>
							<h3 className="text-3xl font-bold tracking-tighter text-curator-on-background">
								{stats.orderCount.toLocaleString()}
							</h3>
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-curator-surface-container text-curator-primary">
							<ShoppingBag className="h-5 w-5" />
						</div>
					</div>
					<div className="flex items-center text-sm font-medium text-curator-on-surface-variant">
						<TrendingUp className="mr-1 h-4 w-4 text-curator-primary" />
						Products: {stats.productCount}
					</div>
				</div>
			</div>
		</div>
	);
}