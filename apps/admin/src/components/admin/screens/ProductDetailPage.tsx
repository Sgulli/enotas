import { Link, useLoaderData } from "@tanstack/react-router";
import { Button } from "@repo/ui";
import { ArrowLeft, Pencil, Package } from "lucide-react";
import { PageHeader } from "../shared/PageHeader";
import { StatusBadge } from "../shared/StatusBadge";

export function ProductDetailPage() {
	const { product } = useLoaderData({ from: "/_admin/products/$productId" });

	return (
		<div className="mx-auto w-full max-w-4xl p-8 md:p-12">
			<div className="mb-8">
				<Link
					to="/products"
					className="inline-flex items-center gap-2 text-sm font-medium text-curator-primary hover:underline"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to catalog
				</Link>
			</div>

			<PageHeader
				eyebrow="Products"
				title={product.name}
				description={product.description ?? "No description"}
				className="mb-10"
				actions={
					<Button asChild className="bg-gradient-to-br from-curator-primary to-curator-primary-container font-medium text-curator-on-primary shadow-lg">
						<Link
							to="/products/$productId/edit"
							params={{ productId: product.id }}
							className="inline-flex items-center gap-2"
						>
							<Pencil className="h-4 w-4" />
							Edit
						</Link>
					</Button>
				}
			/>

			<div className="grid gap-6 md:grid-cols-[1fr_280px]">
				<div className="relative space-y-6 rounded-xl border border-curator-outline-variant/20 bg-curator-surface-container-lowest p-6 ring-1 ring-curator-outline-variant/10">
					<div className="absolute right-5 top-5 z-10 sm:right-6 sm:top-6">
						<StatusBadge
							variant={
								product.inventory > 0 ? "product-available" : "product-draft"
							}
							label={product.inventory > 0 ? "In Stock" : "Out of Stock"}
						/>
					</div>
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-wider text-curator-on-surface-variant">
							Pricing
						</h3>
						<p className="mt-1 text-2xl font-bold text-curator-primary">
							${Number(product.price).toFixed(2)}
						</p>
						{product.compareAtPrice && (
							<p className="text-sm text-curator-on-surface-variant line-through">
								Was ${Number(product.compareAtPrice).toFixed(2)}
							</p>
						)}
					</div>
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-wider text-curator-on-surface-variant">
							Inventory
						</h3>
						<p className="mt-1 flex items-center gap-2 text-curator-on-surface">
							<Package className="h-4 w-4 text-curator-secondary" />
							{product.inventory} in stock
						</p>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<h3 className="text-xs font-semibold uppercase tracking-wider text-curator-on-surface-variant">
								SKU
							</h3>
							<p className="mt-1 text-sm text-curator-on-surface">
								{product.sku ?? "—"}
							</p>
						</div>
						<div>
							<h3 className="text-xs font-semibold uppercase tracking-wider text-curator-on-surface-variant">
								Barcode
							</h3>
							<p className="mt-1 text-sm text-curator-on-surface">
								{product.barcode ?? "—"}
							</p>
						</div>
					</div>
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-wider text-curator-on-surface-variant">
							Category
						</h3>
						<p className="mt-1 text-sm text-curator-on-surface">
							{product.category?.name ?? "Uncategorized"}
						</p>
					</div>
				</div>

				<div className="space-y-4">
					{product.image && (
						<div className="overflow-hidden rounded-xl border border-curator-outline-variant/20 bg-curator-surface-container-low">
							<img
								src={product.image}
								alt={product.name}
								className="aspect-square w-full object-cover"
							/>
						</div>
					)}
					<div className="rounded-xl border border-curator-outline-variant/15 bg-curator-surface-container-low p-4 text-xs text-curator-on-surface-variant">
						<p>
							<span className="font-medium text-curator-on-surface">Slug:</span>{" "}
							{product.slug}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
