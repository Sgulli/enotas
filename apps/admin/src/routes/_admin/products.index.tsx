import { createFileRoute } from "@tanstack/react-router";
import { getProducts } from "#/server/products";
import { ProductCatalogPage } from "#/components/admin/screens/ProductCatalogPage";

export const Route = createFileRoute("/_admin/products/")({
	loader: async () => {
		const products = await getProducts();
		return { products };
	},
	component: ProductCatalogPage,
});
