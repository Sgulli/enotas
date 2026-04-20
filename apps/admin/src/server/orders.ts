import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@repo/db";

export const getOrders = createServerFn({ method: "GET" }).handler(async () => {
	const prisma = getPrisma();
	const orders = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			user: { select: { id: true, name: true, email: true } },
			items: {
				include: {
					product: { select: { id: true, name: true } },
				},
			},
		},
	});
	return orders.map((o) => ({
		...o,
		total: o.total.toString(),
		subtotal: o.subtotal.toString(),
		tax: o.tax.toString(),
		shippingCost: o.shippingCost.toString(),
		createdAt: o.createdAt.toISOString(),
		updatedAt: o.updatedAt.toISOString(),
		items: o.items.map((i) => ({
			...i,
			price: i.price.toString(),
			createdAt: i.createdAt.toISOString(),
		})),
	}));
});

export const getOrderStats = createServerFn({ method: "GET" }).handler(async () => {
	const prisma = getPrisma();
	const [totalRevenue, pendingCount, totalCount] = await Promise.all([
		prisma.order.aggregate({ _sum: { total: true } }),
		prisma.order.count({ where: { status: "pending" } }),
		prisma.order.count(),
	]);
	return {
		totalRevenue: totalRevenue._sum.total?.toString() ?? "0",
		pendingCount,
		totalCount,
	};
});