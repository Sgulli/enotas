import { Filter, Package, Plus } from "lucide-react";
import { Link, useLoaderData } from "@tanstack/react-router";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardTitle,
} from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { ProductCatalogAddTile } from "#/components/admin/blocks";
import { PageHeader } from "../shared/PageHeader";
import { StatusBadge } from "../shared/StatusBadge";

const productCardClass =
	"group relative gap-0 overflow-hidden border-curator-outline-variant/20 bg-curator-surface-container-lowest py-0 shadow-[0_15px_40px_-5px_rgba(0,30,64,0.06)] ring-1 ring-curator-outline-variant/10 transition hover:-translate-y-1";

export function ProductCatalogPage() {
	const { products } = useLoaderData({ from: "/_admin/products/" });

	return (
		<div className="mx-auto w-full max-w-7xl p-8 md:p-12">
			<PageHeader
				eyebrow="Inventory Management"
				title="Products"
				description="Manage and curate your product catalog."
				titleClassName="text-3xl font-bold tracking-tight text-curator-primary"
				className="mb-12"
				actions={
					<>
						<Button
							type="button"
							variant="outline"
							className="border-curator-outline-variant/30 bg-curator-surface-container-highest font-medium text-curator-on-surface hover:bg-curator-surface-variant"
						>
							<Filter />
							Filter Options
						</Button>
						<Button
							type="button"
							asChild
							className="bg-gradient-to-br from-curator-primary to-curator-primary-container font-medium text-curator-on-primary shadow-lg hover:shadow-[0_8px_24px_rgba(0,30,64,0.15)]"
						>
							<Link to="/products/new" className="inline-flex items-center gap-2">
								<Plus />
								Add New Product
							</Link>
						</Button>
					</>
				}
			/>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{products.map((product) => (
					<Link
						key={product.id}
						to="/products/$productId"
						params={{ productId: product.id }}
						className={cn(
							productCardClass,
							"block h-full cursor-pointer no-underline outline-none transition focus-visible:ring-2 focus-visible:ring-curator-primary",
						)}
					>
					<Card className="h-full border-0 bg-transparent shadow-none ring-0">
						<div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-curator-primary to-curator-primary-container opacity-0 transition group-hover:opacity-100" />
						<CardContent className="relative z-10 flex flex-col gap-4 px-6 pb-2 pt-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<span className="mb-1 block text-[11px] font-medium uppercase tracking-widest text-curator-primary">
										{product.category?.name ?? "Uncategorized"}
									</span>
									<CardTitle className="mb-1 text-sm font-bold leading-tight text-curator-primary">
										{product.name}
									</CardTitle>
									<p className="text-xs text-curator-on-surface-variant line-clamp-2">
										{product.description ?? "No description"}
									</p>
								</div>
								{product.image && (
									<img
										src={product.image}
										alt={product.name}
										className="ml-3 h-16 w-16 shrink-0 rounded-lg border border-curator-outline-variant/20 object-cover"
									/>
								)}
							</div>
							<div className="flex items-center gap-3 text-xs font-medium text-curator-secondary">
								<span className="flex items-center gap-1">
									<Package className="h-3.5 w-3.5" />
									{product.inventory} in stock
								</span>
								{product.sku && (
									<>
										<span className="h-1 w-1 rounded-full bg-curator-outline-variant" />
										<span>{product.sku}</span>
									</>
								)}
							</div>
						</CardContent>
						<CardFooter className="relative z-10 flex items-center justify-between border-t border-curator-outline-variant/10 bg-transparent px-6 pb-6 pt-4">
							<span className="text-lg font-bold text-curator-primary">
								${Number(product.price).toFixed(2)}
							</span>
							<StatusBadge
								variant={
									product.inventory > 0 ? "product-available" : "product-draft"
								}
								label={product.inventory > 0 ? "In Stock" : "Out of Stock"}
							/>
						</CardFooter>
					</Card>
					</Link>
				))}
				<ProductCatalogAddTile />
			</div>
		</div>
	);
}
