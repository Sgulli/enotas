import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@repo/ui";

export function ProductCatalogAddTile() {
	return (
		<Button
			type="button"
			asChild
			variant="outline"
			className="flex min-h-[250px] h-auto w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-curator-outline-variant/30 bg-curator-surface-container-low p-6 hover:bg-curator-surface-container-highest"
		>
			<Link to="/products/new" className="flex flex-col items-center">
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-curator-surface-container-lowest shadow-sm">
					<Plus className="h-8 w-8 text-curator-primary" />
				</div>
				<span className="text-sm font-bold text-curator-primary">
					Curate New Entry
				</span>
				<span className="mt-2 text-xs text-curator-on-surface-variant">
					Upload document or create manual record
				</span>
			</Link>
		</Button>
	);
}
