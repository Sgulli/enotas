"use client";

import { useMemo, useState } from "react";
import { FormBuilder } from "@repo/form-builder";
import type { FormUiFieldOptions } from "@repo/form-builder";
import type { ProductWritePayload, SerializedProduct } from "#/server/products";
import { toJsonSchema } from "#/lib/to-json-schema";
import { Button } from "@repo/ui";
import { Loader2 } from "lucide-react";
import * as z from "zod";

export type ProductFormCategoryOption = {
	id: string;
	name: string;
};

const productFormZodSchema = z.object({
	name: z
		.string()
		.min(1)
		.meta({ title: "Name" })
		.describe("Customer-facing title shown in the catalog and detail page."),
	slug: z
		.string()
		.optional()
		.meta({ title: "Slug" })
		.describe("Leave blank to derive from the name."),
	description: z
		.string()
		.optional()
		.meta({ title: "Description" })
		.describe("Use one or two concise sentences to describe the product."),
	price: z
		.number()
		.min(0)
		.meta({ title: "Price" })
		.describe("Current selling price."),
	compareAtPrice: z
		.number()
		.min(0)
		.optional()
		.meta({ title: "Compare-at price" })
		.describe("Optional reference price for merchandising."),
	inventory: z
		.number()
		.int()
		.min(0)
		.meta({ title: "Inventory" })
		.describe("Whole units currently available."),
	categoryId: z
		.string()
		.optional()
		.meta({ title: "Category" })
		.describe("Choose where this product should appear in the catalog."),
	sku: z
		.string()
		.optional()
		.meta({ title: "SKU" })
		.describe("Internal stock keeping identifier."),
	barcode: z
		.string()
		.optional()
		.meta({ title: "Barcode" })
		.describe("Optional scanner-friendly identifier."),
	image: z
		.string()
		.optional()
		.meta({ title: "Image URL" })
		.describe("Main thumbnail shown on product cards and detail views."),
});

// Stable schema derived once — no UI metadata inside.
const productFormSchema = toJsonSchema(productFormZodSchema);

interface ProductFormProps {
	mode: "create" | "edit";
	categories: ProductFormCategoryOption[];
	initialProduct?: SerializedProduct | null;
	onSubmit: (payload: ProductWritePayload) => Promise<void>;
	onCancel?: () => void;
}

function optionalTrimmed(v: unknown): string | null {
	if (v === undefined || v === null) return null;
	if (typeof v === "string") {
		const trimmed = v.trim();
		return trimmed === "" ? null : trimmed;
	}
	if (typeof v === "number" || typeof v === "boolean") {
		const trimmed = `${v}`.trim();
		return trimmed === "" ? null : trimmed;
	}
	return null;
}

function normalizePayload(values: Record<string, unknown>): ProductWritePayload {
	const name = optionalTrimmed(values.name) ?? "";

	const slugRaw = optionalTrimmed(values.slug);
	const slug = slugRaw ?? undefined;

	const description = optionalTrimmed(values.description);

	const price = values.price;
	let priceOut: string | number = 0;
	if (typeof price === "number") {
		priceOut = price;
	} else {
		const normalizedPrice = optionalTrimmed(price);
		if (normalizedPrice !== null) {
			priceOut = normalizedPrice;
		}
	}

	const compareRaw = values.compareAtPrice;
	let compareAtPrice: string | number | null | undefined;
	if (compareRaw === undefined || compareRaw === null || compareRaw === "") {
		compareAtPrice = null;
	} else if (typeof compareRaw === "number") {
		compareAtPrice = compareRaw;
	} else {
		const normalizedCompare = optionalTrimmed(compareRaw);
		compareAtPrice = normalizedCompare ?? null;
	}

	const sku = optionalTrimmed(values.sku);
	const barcode = optionalTrimmed(values.barcode);
	const image = optionalTrimmed(values.image);

	const inv = Number(values.inventory);
	const inventory = Number.isFinite(inv) ? Math.trunc(inv) : 0;

	const cat = values.categoryId;
	const categoryId = optionalTrimmed(cat) ?? null;

	return {
		name,
		slug,
		description: description ?? null,
		price: priceOut,
		compareAtPrice,
		sku,
		barcode,
		image,
		inventory,
		categoryId,
	};
}

const PRODUCT_FORM_ORDER = [
	"name",
	"slug",
	"description",
	"price",
	"compareAtPrice",
	"inventory",
	"categoryId",
	"sku",
	"barcode",
	"image",
] as const;

const ROW_ALIGNMENT_CLASS =
	"flex h-full flex-col [&>p]:min-h-10 md:[&>p]:min-h-8 [&>div:last-child]:mt-auto";

const TALL_ROW_ALIGNMENT_CLASS =
	"flex h-full flex-col [&>p]:min-h-20 md:[&>p]:min-h-16 [&>div:last-child]:mt-auto";

export function ProductForm({
	mode,
	categories,
	initialProduct,
	onSubmit,
	onCancel,
}: Readonly<ProductFormProps>) {
	const [submitting, setSubmitting] = useState(false);
	const isEditing = mode === "edit";

	const categoryOptions = useMemo(
		() => [
			{ value: "", label: "Uncategorized" },
			...categories.map((c) => ({ value: c.id, label: c.name })),
		],
		[categories],
	);

	const fieldOptions = useMemo<Record<string, FormUiFieldOptions>>(
		() => ({
			name: { placeholder: "Premium archival notebook", className: TALL_ROW_ALIGNMENT_CLASS },
			slug: { placeholder: "premium-archival-notebook", className: TALL_ROW_ALIGNMENT_CLASS },
			description: { fieldType: "textarea", rows: 4, className: "sm:col-span-2" },
			price: { step: 0.01, className: ROW_ALIGNMENT_CLASS },
			compareAtPrice: { step: 0.01, className: ROW_ALIGNMENT_CLASS },
			inventory: { className: ROW_ALIGNMENT_CLASS },
			categoryId: { options: categoryOptions, className: ROW_ALIGNMENT_CLASS },
			sku: { placeholder: "NOTE-001", className: ROW_ALIGNMENT_CLASS },
			barcode: { placeholder: "9780000000000", className: ROW_ALIGNMENT_CLASS },
			image: { placeholder: "https://example.com/product-cover.jpg", className: "sm:col-span-2" },
		}),
		[categoryOptions],
	);

	const defaultValues = useMemo(
		() => ({
			name: initialProduct?.name ?? "",
			slug: initialProduct?.slug ?? "",
			description: initialProduct?.description ?? "",
			price: initialProduct ? Number(initialProduct.price) : 0,
			compareAtPrice:
				initialProduct?.compareAtPrice != null &&
				initialProduct.compareAtPrice !== ""
					? Number(initialProduct.compareAtPrice)
					: undefined,
			inventory: initialProduct?.inventory ?? 0,
			categoryId: initialProduct?.categoryId ?? "",
			sku: initialProduct?.sku ?? "",
			barcode: initialProduct?.barcode ?? "",
			image: initialProduct?.image ?? "",
		}),
		[initialProduct],
	);

	const handleSubmit = async (values: Record<string, unknown>) => {
		setSubmitting(true);
		try {
			await onSubmit(normalizePayload(values));
		} finally {
			setSubmitting(false);
		}
	};

	let submitButtonLabel = "Create product";
	if (submitting) {
		submitButtonLabel = "Saving...";
	} else if (isEditing) {
		submitButtonLabel = "Save changes";
	}

	return (
		<div className="overflow-hidden rounded-[28px] border border-curator-outline-variant/20 bg-curator-surface-container-lowest shadow-[0_24px_60px_-20px_rgba(0,30,64,0.18)] ring-1 ring-curator-outline-variant/10">
			<div className="h-1.5 w-full bg-gradient-to-r from-curator-primary via-curator-secondary to-curator-primary-container" />
			<div className="p-6 md:p-8">
				{submitting && (
					<div
						role="status"
						aria-live="polite"
						className="mb-5 flex items-center gap-3 rounded-2xl border border-curator-primary/15 bg-curator-primary/5 px-4 py-3 text-sm text-curator-on-surface"
					>
						<Loader2
							aria-hidden="true"
							className="h-4 w-4 animate-spin text-curator-primary"
						/>
						<span>Saving product changes...</span>
					</div>
				)}

				<FormBuilder
					schema={productFormSchema}
					layout="two-column"
					order={PRODUCT_FORM_ORDER}
					fields={fieldOptions}
					defaultValues={defaultValues}
					onSubmit={handleSubmit}
					disabled={submitting}
					className="gap-x-5 gap-y-5"
					footer={
						<div className="mt-8 border-t border-curator-outline-variant/10 pt-5">
							<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
								{onCancel && (
									<Button
										type="button"
										variant="outline"
										onClick={onCancel}
										disabled={submitting}
										className="cursor-pointer border-curator-outline-variant/35 bg-curator-surface-container-lowest text-curator-on-surface hover:bg-curator-surface-container-low"
									>
										Cancel
									</Button>
								)}
								<Button
									type="submit"
									disabled={submitting}
									className="cursor-pointer bg-gradient-to-br from-curator-primary to-curator-primary-container text-curator-on-primary shadow-[0_10px_24px_-12px_rgba(0,30,64,0.55)] transition-opacity hover:opacity-95"
								>
									{submitting && (
										<Loader2
											aria-hidden="true"
											className="mr-2 h-4 w-4 animate-spin"
										/>
									)}
									{submitButtonLabel}
								</Button>
							</div>
						</div>
					}
				/>
			</div>
		</div>
	);
}
