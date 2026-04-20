import { createFileRoute,Link, useRouter } from "@tanstack/react-router";
import { getCategories } from "#/server/categories";
import { createProduct } from "#/server/products";
import { ProductForm } from "#/components/admin/shared/ProductForm";
import { PageHeader } from "#/components/admin/shared/PageHeader";


export const Route = createFileRoute("/_admin/products/new")({
	loader: async () => {
		const categories = await getCategories();
		return { categories };
	},
	component: ProductNewPage,
});

function ProductNewPage() {
	const { categories } = Route.useLoaderData();
	const router = useRouter();

	return (
		<div className="mx-auto w-full max-w-3xl p-8 md:p-12">
			<div className="mb-8">
				<Link
					to="/products"
					className="text-sm font-medium text-curator-primary hover:underline"
				>
					← Back to catalog
				</Link>
			</div>
			<PageHeader
				eyebrow="Products"
				title="Add product"
				description="Create a new catalog entry. Slug is generated from the name if left blank."
				className="mb-10"
			/>
			<ProductForm
				mode="create"
				categories={categories}
				onSubmit={async (payload) => {
					const created = await createProduct({ data: payload });
					await router.navigate({
						to: "/products/$productId",
						params: { productId: created.id },
					});
				}}
				onCancel={() => {
					router.navigate({ to: "/products" });
				}}
			/>
		</div>
	);
}
