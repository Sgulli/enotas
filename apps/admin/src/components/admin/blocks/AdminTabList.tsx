import { cn } from "@repo/ui/lib/utils";

interface AdminTabListProps {
	tabs: string[];
	activeIndex?: number;
	onChange?: (index: number) => void;
	className?: string;
}

export function AdminTabList({
	tabs,
	activeIndex = 0,
	onChange,
	className,
}: AdminTabListProps) {
	return (
		<div
			className={cn("mb-8 flex gap-8 border-b border-transparent", className)}
			role="tablist"
		>
			{tabs.map((tab, i) => (
				<button
					key={tab}
					type="button"
					role="tab"
					aria-selected={i === activeIndex}
					onClick={() => onChange?.(i)}
					className={cn(
						"pb-3 text-sm font-medium transition",
						i === activeIndex
							? "border-b-2 border-curator-primary text-curator-primary"
							: "text-curator-outline-variant hover:text-curator-on-surface-variant",
					)}
				>
					{tab}
				</button>
			))}
		</div>
	);
}
