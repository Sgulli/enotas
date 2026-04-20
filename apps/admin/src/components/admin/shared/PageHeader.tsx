import type { ReactNode } from "react";
import { CardDescription } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";

interface PageHeaderProps {
	title: string;
	description?: string;
	eyebrow?: string;
	actions?: ReactNode;
	titleClassName?: string;
	descriptionClassName?: string;
	className?: string;
}

export function PageHeader({
	title,
	description,
	eyebrow,
	actions,
	titleClassName = "text-3xl font-bold tracking-tight text-curator-primary",
	descriptionClassName,
	className = "",
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"mb-10 flex flex-col items-start justify-between gap-4",
				actions !== undefined && "md:flex-row md:items-center",
				className,
			)}
		>
			<div>
				{eyebrow  && (
					<span className="mb-2 block text-xs font-medium uppercase tracking-wider text-curator-primary">
						{eyebrow}
					</span>
				)}
				<h2 className={titleClassName}>{title}</h2>
				{description  && (
					<CardDescription
						className={cn(
							"mt-1 text-curator-on-surface-variant",
							descriptionClassName,
						)}
					>
						{description}
					</CardDescription>
				)}
			</div>
			{actions  && (
				<div className="flex flex-wrap gap-3">{actions}</div>
			)}
		</div>
	);
}
