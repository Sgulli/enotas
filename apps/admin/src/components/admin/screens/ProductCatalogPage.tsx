import { useState, useCallback } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useLoaderData, useNavigate, useRouter } from "@tanstack/react-router";
import {
  Button,
  CardContent,
  CardHeader,
  DataTable,
  useColumns,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui";
import { AdminStatCard, CuratorCard } from "#/components/admin/blocks";
import { PageHeader } from "../shared/PageHeader";
import { StatusBadge } from "../shared/StatusBadge";
import { ProductFormModal } from "../shared/ProductFormModal";
import type { SerializedProduct, ProductWritePayload } from "#/server/products";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "#/server/products";
import { getAllCategories } from "#/server/categories";
import type { ProductFormCategoryOption } from "../shared/ProductForm";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: string;
  inventory: number;
  category?: { name: string } | null;
  sku?: string | null;
}

const thBase =
  "px-6 py-4 text-xs font-semibold uppercase tracking-widest text-curator-on-surface-variant";
const tdBase = "px-6 py-5";

const VISIBLE_PAGES = 5;

function getVisiblePageRange(current: number, totalPages: number) {
  if (totalPages <= VISIBLE_PAGES) return { start: 1, end: totalPages };
  const half = Math.floor(VISIBLE_PAGES / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(totalPages, start + VISIBLE_PAGES - 1);
  if (end - start + 1 < VISIBLE_PAGES)
    start = Math.max(1, end - VISIBLE_PAGES + 1);
  return { start, end };
}

export function ProductCatalogPage() {
  const { products, total, page, pageSize, totalCount } = useLoaderData({
    from: "/_admin/products/",
  });
  const navigate = useNavigate();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<SerializedProduct | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<ProductFormCategoryOption[]>([]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const setPage = useCallback(
    (p: number) => {
      void navigate({
        to: "/products",
        search: (prev) => ({ ...prev, page: p }),
      });
    },
    [navigate],
  );

  const handleCreate = useCallback(async () => {
    const all = await getAllCategories();
    setCategoryOptions(all);
    setModalMode("create");
    setEditingProduct(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback(async (product: SerializedProduct) => {
    const all = await getAllCategories();
    setCategoryOptions(all);
    setModalMode("edit");
    setEditingProduct(product);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (productId: string) => {
      if (!confirm("Are you sure you want to delete this product?")) return;
      await deleteProduct({ data: { id: productId } });
      router.invalidate();
    },
    [router],
  );

  const handleSubmit = useCallback(
    async (payload: ProductWritePayload) => {
      if (modalMode === "edit" && editingProduct) {
        await updateProduct({ data: { ...payload, id: editingProduct.id } });
      } else {
        await createProduct({ data: payload });
      }
      router.invalidate();
    },
    [modalMode, editingProduct, router],
  );

  const outOfStockCount = products.filter((p) => p.inventory <= 0).length;

  const columns = useColumns<ProductRow>(
    (h) => [
      h.accessor("name", {
        header: "Product",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div>
              <div className="font-semibold text-curator-on-surface">
                {info.getValue()}
              </div>
              <div className="text-xs text-curator-on-surface-variant">
                {row.sku ?? row.slug}
              </div>
            </div>
          );
        },
      }),
      h.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="text-sm text-curator-on-surface-variant">
            {info.getValue()?.name ?? "Uncategorized"}
          </span>
        ),
      }),
      h.accessor("price", {
        header: "Price",
        cell: (info) => (
          <span className="font-semibold text-curator-primary">
            ${Number(info.getValue()).toFixed(2)}
          </span>
        ),
      }),
      h.accessor("inventory", {
        header: "Stock",
        cell: (info) => (
          <span className="text-sm text-curator-on-surface-variant">
            {info.getValue()}
          </span>
        ),
      }),
      h.accessor("inventory", {
        id: "status",
        header: "Status",
        cell: (info) => {
          const inv = info.getValue() as number;
          return (
            <StatusBadge
              variant={inv > 0 ? "product-available" : "product-draft"}
              label={inv > 0 ? "In Stock" : "Out of Stock"}
            />
          );
        },
      }),
      h.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const product = info.row.original as unknown as SerializedProduct;
          return (
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-curator-on-surface-variant hover:text-curator-primary"
                aria-label="Edit"
                onClick={() => handleEdit(product)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-curator-on-surface-variant hover:text-curator-error"
                aria-label="Delete"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      }),
    ],
    [handleEdit, handleDelete],
  );

  const { start, end } = getVisiblePageRange(page, totalPages);
  const firstRow = (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, total);

  return (
    <div className="mx-auto max-w-6xl p-8">
      <PageHeader
        eyebrow="Inventory Management"
        title="Products"
        description="Manage and curate your product catalog."
        titleClassName="text-3xl font-bold tracking-tight text-curator-primary"
        actions={
          <Button
            type="button"
            className="bg-gradient-to-br from-curator-primary to-curator-primary-container font-semibold text-curator-on-primary shadow-[0_4px_14px_0_rgba(0,30,64,0.15)]"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        }
      />

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <AdminStatCard
          label="Total Products"
          value={String(totalCount)}
          icon={<Package className="h-5 w-5" />}
          footer={
            <span className="flex items-center gap-1 font-medium text-curator-tertiary-fixed-dim">
              <TrendingUp className="h-3 w-3" />
              In catalog
            </span>
          }
        />
        <AdminStatCard
          label="In Stock"
          value={String(totalCount - outOfStockCount)}
          icon={<Package className="h-5 w-5" />}
          footer={
            <span className="text-curator-on-surface-variant">
              Available for sale
            </span>
          }
        />
        <AdminStatCard
          label="Out of Stock"
          value={String(outOfStockCount)}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconClassName="rounded-lg bg-curator-error-container/50 p-2 text-curator-error"
          footer={
            <span className="text-curator-on-surface-variant">
              Need restocking
            </span>
          }
        />
      </div>

      <CuratorCard className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b border-curator-outline-variant/10 px-6 py-4">
          <h3 className="text-lg font-bold text-curator-primary">
            All Products
          </h3>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <DataTable
            columns={columns}
            data={products}
            headRowClassName="border-curator-outline-variant/10 bg-curator-surface hover:bg-curator-surface"
            headCellClassName={(colId) =>
              `${thBase} ${colId === "actions" ? "text-center" : "text-left"}`
            }
            bodyRowClassName="group border-curator-outline-variant/10 hover:bg-curator-surface-container-low"
            bodyCellClassName={(colId) => {
              const base = `${tdBase} text-sm`;
              return colId === "actions" ? `${base} text-center` : base;
            }}
          />
        </CardContent>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-curator-outline-variant/10 bg-curator-surface-container-lowest px-6 py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && setPage(page - 1)}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {start > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(1)}
                      className="cursor-pointer"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}

                {start > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {Array.from({ length: end - start + 1 }, (_, i) => {
                  const p = start + i;
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {end < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {end < totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < totalPages && setPage(page + 1)}
                    className={
                      page >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <span className="text-xs font-semibold text-curator-on-surface-variant">
              {firstRow}–{lastRow} of {total}
            </span>
          </div>
        )}
      </CuratorCard>

      <ProductFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        product={editingProduct}
        categories={categoryOptions}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
