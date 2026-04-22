import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Download,
  Filter,
  MoreVertical,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
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
import { columnUtils } from "#/lib/table-utils";
import { useCallback } from "react";

const ORDER_STATUS_MAP: Record<string, string> = {
  pending: "order-pending",
  completed: "order-completed",
  refunded: "order-refunded",
  delivered: "order-completed",
  cancelled: "order-refunded",
};

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  completed: "Completed",
  refunded: "Refunded",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface OrderRow {
  id: string;
  total: string;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string | null } | null;
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

export function OrdersPage() {
  const { orders, total, page, pageSize, stats } = useLoaderData({
    from: "/_admin/orders",
  });
  const navigate = useNavigate();

  const formattedRevenue = Number(stats.totalRevenue).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const setPage = useCallback(
    (p: number) => {
      void navigate({
        to: "/orders",
        search: (prev) => ({ ...prev, page: p }),
      });
    },
    [navigate],
  );

  const columns = useColumns<OrderRow>(
    (h) => [
      h.accessor("id", {
        header: "Order ID",
        cell: (info) => (
          <span className="font-medium text-curator-primary">
            #{info.getValue().slice(0, 8)}
          </span>
        ),
      }),
      h.accessor("user", {
        header: "Customer",
        cell: (info) => {
          const user = info.getValue();
          const initials =
            user?.name
              ?.split(" ")
              .map((p: string) => p[0])
              .join("") ?? "?";
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-curator-primary-fixed text-xs font-bold text-curator-primary-fixed-dim">
                {initials}
              </div>
              <div>
                <div className="font-semibold text-curator-on-surface">
                  {user?.name ?? "Unknown"}
                </div>
                <div className="text-xs text-curator-on-surface-variant">
                  {user?.email ?? ""}
                </div>
              </div>
            </div>
          );
        },
      }),
      columnUtils.date(h, "createdAt", "Date"),
      columnUtils.currency(h, "total", "Amount"),
      columnUtils.mapStatus(
        h,
        "status",
        "Status",
        ORDER_STATUS_MAP,
        ORDER_STATUS_LABEL,
        "order-pending",
      ),
      h.display({
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-curator-on-surface-variant hover:text-curator-primary"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        ),
      }),
    ],
    [],
  );

  const { start, end } = getVisiblePageRange(page, totalPages);
  const firstRow = (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, total);

  return (
    <div className="mx-auto max-w-6xl p-8">
      <PageHeader
        title="Orders Management"
        description="Review and manage orders."
        titleClassName="mb-2 text-3xl font-extrabold tracking-tight text-curator-primary"
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              className="border-curator-outline-variant/30 bg-curator-surface-container-highest font-semibold text-curator-on-surface hover:bg-curator-surface-variant"
            >
              <Download />
              Export CSV
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-br from-curator-primary to-curator-primary-container font-semibold text-curator-on-primary shadow-[0_4px_14px_0_rgba(0,30,64,0.15)]"
            >
              <Filter />
              Filter
            </Button>
          </>
        }
      />

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <AdminStatCard
          label="Total Revenue"
          value={formattedRevenue}
          icon={<Wallet className="h-5 w-5" />}
          footer={
            <span className="flex items-center gap-1 font-medium text-curator-tertiary-fixed-dim">
              <ArrowUp className="h-3 w-3" />
              {stats.totalCount} total orders
            </span>
          }
        />
        <AdminStatCard
          label="Pending Orders"
          value={String(stats.pendingCount)}
          icon={<ShoppingBag className="h-5 w-5" />}
          footer={
            <span className="flex items-center gap-1 text-curator-on-surface-variant">
              <CheckCircle className="h-3 w-3" />
              Awaiting fulfillment
            </span>
          }
        />
        <AdminStatCard
          label="Total Orders"
          value={String(stats.totalCount)}
          icon={<ArrowDown className="h-5 w-5" />}
          iconClassName="rounded-lg bg-curator-error-container/50 p-2 text-curator-error"
          footer={
            <span className="flex items-center gap-1 text-curator-on-surface-variant">
              All time orders
            </span>
          }
        />
      </div>

      <CuratorCard className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b border-curator-outline-variant/10 px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-6">
              {["All Orders", "Pending", "Completed", "Refunded"].map(
                (tab, i) => (
                  <button
                    key={tab}
                    type="button"
                    className={
                      i === 0
                        ? "border-b-2 border-curator-primary pb-2 text-sm font-bold text-curator-primary"
                        : "border-b-2 border-transparent pb-2 text-sm font-medium text-curator-on-surface-variant hover:text-curator-primary"
                    }
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <DataTable
            columns={columns}
            data={orders}
            headRowClassName="border-curator-outline-variant/10 bg-curator-surface hover:bg-curator-surface"
            headCellClassName={() => thBase}
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
    </div>
  );
}
