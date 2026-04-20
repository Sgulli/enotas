import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@repo/db";

export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
	const prisma = getPrisma();
	const categories = await prisma.categories.findMany({
		orderBy: { name: "asc" },
		include: {
			products: { select: { id: true } },
			parent: { select: { name: true } },
		},
	});
	return categories.map((c) => ({
		...c,
		productCount: c.products.length,
		products: undefined,
		parentName: c.parent?.name ?? null,
		parent: undefined,
		createdAt: c.createdAt.toISOString(),
		updatedAt: c.updatedAt.toISOString(),
	}));
});

export const getCategoryCount = createServerFn({ method: "GET" }).handler(async () => {
	const prisma = getPrisma();
	const count = await prisma.categories.count();
	return count;
});