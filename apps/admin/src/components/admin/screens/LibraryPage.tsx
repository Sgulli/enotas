import { BookMarked, Layers, Shield } from "lucide-react";
import { Button } from "@repo/ui";
import { AdminStatCard } from "#/components/admin/blocks";
import { PageHeader } from "../shared/PageHeader";

export function LibraryPage() {
	return (
		<div className="mx-auto w-full max-w-7xl p-8">
			<PageHeader
				title="Library collections"
				description="Curate stacks, access tiers, and preservation policies for the repository."
				titleClassName="mb-2 text-3xl font-bold tracking-tight text-curator-on-background"
				className="mb-10"
			/>

			<div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
				<AdminStatCard
					label="Indexed volumes"
					value="18,402"
					icon={<BookMarked className="h-6 w-6" />}
					iconClassName="p-0 text-curator-primary"
					labelClassName="text-sm font-medium uppercase tracking-wider text-curator-on-surface-variant"
					valueClassName="text-4xl font-bold tracking-tight text-curator-primary"
					footer={
						<p className="text-sm text-curator-on-surface-variant">
							Across 24 subject trees
						</p>
					}
					className="shadow-sm ring-curator-outline-variant/15"
				/>
				<AdminStatCard
					label="Embargoed items"
					value="37"
					icon={<Shield className="h-6 w-6" />}
					iconClassName="p-0 text-curator-tertiary"
					labelClassName="text-sm font-medium uppercase tracking-wider text-curator-on-surface-variant"
					valueClassName="text-4xl font-bold tracking-tight text-curator-primary"
					footer={
						<p className="text-sm text-curator-on-surface-variant">
							Awaiting rights clearance
						</p>
					}
					className="shadow-sm ring-curator-outline-variant/15"
				/>
				<AdminStatCard
					label="Active stacks"
					value="12"
					icon={<Layers className="h-6 w-6" />}
					iconClassName="p-0 text-curator-secondary"
					labelClassName="text-sm font-medium uppercase tracking-wider text-curator-on-surface-variant"
					valueClassName="text-4xl font-bold tracking-tight text-curator-primary"
					footer={
						<p className="text-sm text-curator-on-surface-variant">
							With circulation rules
						</p>
					}
					className="shadow-sm ring-curator-outline-variant/15"
				/>
			</div>

			<div className="rounded-xl bg-gradient-to-br from-curator-primary to-curator-primary-container p-8 text-curator-on-primary shadow-[0_40px_60px_-15px_rgba(0,30,64,0.12)]">
				<h3 className="text-xl font-bold tracking-tight">
					Access policy preview
				</h3>
				<p className="mt-2 max-w-2xl text-sm text-curator-primary-fixed-dim">
					Undergraduate stacks remain campus-only; postgraduate theses unlock
					after committee approval. Adjust rules per department without taking
					collections offline.
				</p>
				<Button
					type="button"
					variant="ghost"
					className="mt-6 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-curator-on-primary backdrop-blur hover:bg-white/25"
				>
					Edit policy
				</Button>
			</div>
		</div>
	);
}
