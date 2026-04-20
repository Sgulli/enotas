import { Plus, TrendingUp } from "lucide-react";
import { useLoaderData } from "@tanstack/react-router";
import { PageHeader } from "../shared/PageHeader";
import { StatusBadge } from "../shared/StatusBadge";

export function CategoriesManagementPage() {
	const { categories } = useLoaderData({ from: "/_admin/categories" });

	return (
		<div className="mx-auto max-w-6xl p-12">
			<PageHeader
				title="Category Taxonomy"
				description="Manage the classification structures for your product catalog."
				titleClassName="mb-2 text-4xl font-extrabold tracking-tight text-curator-primary"
				className="mb-12"
				actions={
					<button
						type="button"
						className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-curator-primary to-curator-primary-container px-6 py-3 font-semibold text-white shadow-[0_8px_16px_-4px_rgba(0,30,64,0.15)] transition hover:shadow-[0_12px_24px_-6px_rgba(0,30,64,0.2)]"
					>
						<Plus className="h-4 w-4" />
						Add Category
					</button>
				}
			/>

			<div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
				<div className="relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl bg-curator-surface-container-lowest p-8 shadow-[0_20px_40px_-15px_rgba(0,30,64,0.04)]">
					<div className="absolute right-0 top-0 p-6 opacity-10">
						<TrendingUp className="h-24 w-24 text-curator-primary" />
					</div>
					<div>
						<p className="mb-2 text-xs font-medium uppercase tracking-widest text-curator-on-surface-variant">
							Total Categories
						</p>
						<h3 className="text-5xl font-black tracking-tighter text-curator-primary">
							{categories.length}
						</h3>
					</div>
					<div className="mt-8 flex w-fit items-center rounded-full bg-curator-tertiary-fixed/30 px-3 py-1 text-sm font-medium text-curator-tertiary-container">
						<TrendingUp className="mr-1 h-3 w-3" />
						Active categories
					</div>
				</div>

				<div className="col-span-1 flex items-center justify-between rounded-xl bg-curator-surface-container-lowest p-8 shadow-[0_20px_40px_-15px_rgba(0,30,64,0.04)] md:col-span-2">
					<div className="flex-1 pr-8">
						<h4 className="mb-2 text-lg font-bold text-curator-primary">
							Product Distribution
						</h4>
						<p className="mb-6 text-sm text-curator-on-surface-variant">
							Overview of product allocation across categories.
						</p>
						<div className="flex h-2 gap-1 overflow-hidden rounded-full">
							{categories.slice(0, 4).map((cat) => (
								<div
									key={cat.id}
									className="bg-curator-primary"
									style={{ flexGrow: cat.productCount || 1 }}
								/>
							))}
						</div>
						<div className="mt-2 flex flex-wrap justify-between gap-2 text-xs font-medium text-curator-on-surface-variant">
							{categories.slice(0, 4).map((cat) => (
								<span key={cat.id}>
									{cat.name} ({cat.productCount})
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="overflow-hidden rounded-xl bg-curator-surface-container-lowest shadow-[0_20px_40px_-15px_rgba(0,30,64,0.04)]">
				<div className="flex flex-wrap items-center justify-between gap-4 bg-curator-surface-container-lowest px-8 py-6">
					<h3 className="text-lg font-bold text-curator-primary">
						All Categories
					</h3>
				</div>

				<div className="grid grid-cols-12 gap-4 bg-curator-surface-container-low px-8 py-4 text-xs font-semibold uppercase tracking-widest text-curator-on-surface-variant">
					<div className="col-span-4">Name</div>
					<div className="col-span-3">Parent</div>
					<div className="col-span-2">Products</div>
					<div className="col-span-2">Status</div>
					<div className="col-span-1 text-right">Actions</div>
				</div>

				{categories.map((cat) => (
					<div
						key={cat.id}
						className="group grid grid-cols-12 items-center gap-4 border-t border-curator-outline-variant/10 px-8 py-5 transition hover:bg-curator-surface-container-low/50"
					>
						<div className="col-span-4">
							<div>
								<h5 className="text-sm font-bold text-curator-primary">
									{cat.name}
								</h5>
								<p className="mt-0.5 text-xs text-curator-on-surface-variant">
									{cat.slug}
								</p>
							</div>
						</div>
						<div className="col-span-3">
							<span className="rounded-md border border-curator-outline-variant/20 bg-curator-surface px-3 py-1 text-sm font-medium text-curator-on-surface-variant">
								{cat.parentName ?? "—"}
							</span>
						</div>
						<div className="col-span-2">
							<span className="text-sm font-bold text-curator-primary">
								{cat.productCount}
							</span>
						</div>
						<div className="col-span-2">
							<StatusBadge variant="category-active" label="Active" />
						</div>
						<div className="col-span-1 flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
							<button
								type="button"
								className="text-slate-400 hover:text-curator-primary"
							>
								Edit
							</button>
							<button
								type="button"
								className="text-slate-400 hover:text-curator-error"
							>
								Del
							</button>
						</div>
					</div>
				))}

				<div className="flex items-center justify-between border-t border-curator-outline-variant/10 px-8 py-4 text-sm text-curator-on-surface-variant">
					<span>Showing {categories.length} categories</span>
				</div>
			</div>
		</div>
	);
}