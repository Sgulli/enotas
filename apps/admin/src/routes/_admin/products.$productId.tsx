import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProductById } from "#/server/products";
import { ProductDetailPage } from "#/components/admin/screens/ProductDetailPage";

export const Route = createFileRoute("/_admin/products/$productId")({
	loader: async ({ params }) => {
		const product = await getProductById({ data: { id: params.productId } });
		if (!product) throw notFound();
		return { product };
	},
	component: ProductDetailPage,
});
