import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@repo/db";

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
	const prisma = getPrisma();
	const [userCount, orderCount, productCount, revenueResult] = await Promise.all([
		prisma.user.count(),
		prisma.order.count(),
		prisma.products.count(),
		prisma.order.aggregate({ _sum: { total: true } }),
	]);
	return {
		userCount,
		orderCount,
		productCount,
		totalRevenue: revenueResult._sum.total?.toString() ?? "0",
	};
});