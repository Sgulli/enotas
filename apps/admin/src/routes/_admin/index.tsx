import { createFileRoute } from "@tanstack/react-router";
import { getDashboardStats } from "#/server/dashboard";
import { DashboardOverviewPage } from "#/components/admin/screens/DashboardOverviewPage";

export const Route = createFileRoute("/_admin/")({
	loader: async () => {
		const stats = await getDashboardStats();
		return { stats };
	},
	component: DashboardOverviewPage,
});