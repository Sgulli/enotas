import { createFileRoute, notFound,Link, useRouter } from "@tanstack/react-router";
import { getCategories } from "#/server/categories";
import { getProductById, updateProduct } from "#/server/products";
import { ProductForm } from "#/components/admin/shared/ProductForm";
import { PageHeader } from "#/components/admin/shared/PageHeader";


export const Route = createFileRoute("/_admin/products_/$productId/edit")({
	loader: async ({ params }) => {
		const [product, categories] = await Promise.all([
			getProductById({ data: { id: params.productId } }),
			getCategories(),
		]);
		if (!product) throw notFound();
		return { product, categories };
	},
	component: ProductEditPage,
});

function ProductEditPage() {
	const { product, categories } = Route.useLoaderData();
	const router = useRouter();

	return (
		<div className="mx-auto w-full max-w-3xl p-8 md:p-12">
			<div className="mb-8">
				<Link
					to="/products/$productId"
					params={{ productId: product.id }}
					className="text-sm font-medium text-curator-primary hover:underline"
				>
					← Back to product
				</Link>
			</div>
			<PageHeader
				eyebrow="Products"
				title="Edit product"
				description="Update pricing, inventory, and merchandising fields."
				className="mb-10"
			/>
			<ProductForm
				mode="edit"
				initialProduct={product}
				categories={categories}
				onSubmit={async (payload) => {
					await updateProduct({ data: { ...payload, id: product.id } });
					await router.navigate({
						to: "/products/$productId",
						params: { productId: product.id },
					});
				}}
				onCancel={() => {
					void router.navigate({
						to: "/products/$productId",
						params: { productId: product.id },
					});
				}}
			/>
		</div>
	);
}
