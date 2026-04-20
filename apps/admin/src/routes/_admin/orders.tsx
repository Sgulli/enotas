import { createFileRoute } from "@tanstack/react-router";
import { getOrders, getOrderStats } from "#/server/orders";
import { OrdersPage } from "#/components/admin/screens/OrdersPage";

export const Route = createFileRoute("/_admin/orders")({
	loader: async () => {
		const [orders, stats] = await Promise.all([
			getOrders(),
			getOrderStats(),
		]);
		return { orders, stats };
	},
	component: OrdersPage,
});