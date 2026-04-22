import { useState, useCallback } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  Tag,
  FolderTree,
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
import { CategoryFormModal } from "../shared/CategoryFormModal";
import type { Category } from "../shared/CategoryFormModal";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from "#/server/categories";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentName?: string | null;
  productCount: number;
  createdAt: string;
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

export function CategoriesManagementPage() {
  const { categories, total, page, pageSize, totalCount } = useLoaderData({
    from: "/_admin/categories",
  });
  const navigate = useNavigate();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentOptions, setParentOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const setPage = useCallback(
    (p: number) => {
      void navigate({
        to: "/categories",
        search: (prev) => ({ ...prev, page: p }),
      });
    },
    [navigate],
  );

  const handleCreate = useCallback(async () => {
    const all = await getAllCategories();
    setParentOptions(all);
    setEditingCategory(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback(async (category: Category) => {
    const all = await getAllCategories();
    setParentOptions(all.filter((c) => c.id !== category.id));
    setEditingCategory(category);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (categoryId: string) => {
      if (!confirm("Are you sure you want to delete this category?")) return;
      await deleteCategory({ data: { id: categoryId } });
      router.invalidate();
    },
    [router],
  );

  const handleSubmit = useCallback(
    async (
      data: Pick<Category, "name" | "slug" | "description" | "parentId">,
    ) => {
      const payload = {
        ...data,
        description: data.description || undefined,
        parentId: data.parentId || undefined,
      };
      if (editingCategory) {
        await updateCategory({
          data: { id: editingCategory.id, ...payload },
        });
      } else {
        await createCategory({ data: payload });
      }
      router.invalidate();
    },
    [editingCategory, router],
  );

  const columns = useColumns<CategoryRow>(
    (h) => [
      h.accessor("name", {
        header: "Name",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div>
              <div className="font-semibold text-curator-on-surface">
                {info.getValue()}
              </div>
              <div className="text-xs text-curator-on-surface-variant">
                {row.slug}
              </div>
            </div>
          );
        },
      }),
      h.accessor("parentName", {
        header: "Parent",
        cell: (info) => {
          const val = info.getValue();
          return val ? (
            <span className="rounded-md border border-curator-outline-variant/20 bg-curator-surface px-3 py-1 text-sm font-medium text-curator-on-surface-variant">
              {val}
            </span>
          ) : (
            <span className="text-sm text-curator-on-surface-variant">—</span>
          );
        },
      }),
      h.accessor("productCount", {
        header: "Products",
        cell: (info) => (
          <span className="font-semibold text-curator-primary">
            {info.getValue()}
          </span>
        ),
      }),
      h.accessor("createdAt", {
        header: "Created",
        cell: (info) => (
          <span className="tabular-nums text-curator-on-surface-variant">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      h.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const category = info.row.original as CategoryRow;
          return (
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-curator-on-surface-variant hover:text-curator-primary"
                aria-label="Edit"
                onClick={() =>
                  handleEdit(category as unknown as Category)
                }
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-curator-on-surface-variant hover:text-curator-error"
                aria-label="Delete"
                onClick={() => handleDelete(category.id)}
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
        title="Categories"
        description="Manage the classification structures for your product catalog."
        titleClassName="mb-2 text-3xl font-extrabold tracking-tight text-curator-primary"
        actions={
          <Button
            type="button"
            className="bg-gradient-to-br from-curator-primary to-curator-primary-container font-semibold text-curator-on-primary shadow-[0_4px_14px_0_rgba(0,30,64,0.15)]"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <AdminStatCard
          label="Total Categories"
          value={String(totalCount)}
          icon={<FolderTree className="h-5 w-5" />}
          footer={
            <span className="flex items-center gap-1 font-medium text-curator-tertiary-fixed-dim">
              <TrendingUp className="h-3 w-3" />
              Active categories
            </span>
          }
        />
        <AdminStatCard
          label="Top Level"
          value={String(
            categories.filter((c) => !c.parentName).length,
          )}
          icon={<Tag className="h-5 w-5" />}
          footer={
            <span className="text-curator-on-surface-variant">
              Without parent
            </span>
          }
        />
        <AdminStatCard
          label="Subcategories"
          value={String(
            categories.filter((c) => c.parentName).length,
          )}
          icon={<FolderTree className="h-5 w-5" />}
          footer={
            <span className="text-curator-on-surface-variant">
              With parent category
            </span>
          }
        />
      </div>

      <CuratorCard className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b border-curator-outline-variant/10 px-6 py-4">
          <h3 className="text-lg font-bold text-curator-primary">
            All Categories
          </h3>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <DataTable
            columns={columns}
            data={categories}
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

      <CategoryFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={editingCategory}
        parentOptions={parentOptions}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
