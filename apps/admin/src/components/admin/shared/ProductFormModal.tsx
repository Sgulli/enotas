"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/dialog";
import { ProductForm } from "./ProductForm";
import type { SerializedProduct, ProductWritePayload } from "#/server/products";
import type { ProductFormCategoryOption } from "./ProductForm";

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  product?: SerializedProduct | null;
  categories: ProductFormCategoryOption[];
  onSubmit: (payload: ProductWritePayload) => Promise<void>;
}

export function ProductFormModal({
  open,
  onOpenChange,
  mode,
  product,
  categories,
  onSubmit,
}: ProductFormModalProps) {
  const handleSubmit = async (payload: ProductWritePayload) => {
    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-semibold text-curator-on-surface">
            {mode === "edit" ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogDescription className="text-curator-on-surface-variant">
            {mode === "edit"
              ? "Update the product details."
              : "Add a new product to the catalog."}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <ProductForm
            mode={mode}
            categories={categories}
            initialProduct={product}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
