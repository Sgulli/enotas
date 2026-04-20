import { createFileRoute } from "@tanstack/react-router";
import { getCategories } from "#/server/categories";
import { CategoriesManagementPage } from "#/components/admin/screens/CategoriesManagementPage";

export const Route = createFileRoute("/_admin/categories")({
	loader: async () => {
		const categories = await getCategories();
		return { categories };
	},
	component: CategoriesManagementPage,
});