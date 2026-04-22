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
import { useLoaderData } from "@tanstack/react-router";
import {
  Button,
  CardContent,
  CardHeader,
  DataTable,
  useColumns,
} from "@repo/ui";
import { AdminStatCard, CuratorCard } from "#/components/admin/blocks";
import { PageHeader } from "../shared/PageHeader";
import { columnUtils } from "#/lib/table-utils";

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

export function OrdersPage() {
  const { orders, stats } = useLoaderData({ from: "/_admin/orders" });
  const formattedRevenue = Number(stats.totalRevenue).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

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
          <div className="flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
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
              className="bg-gradient-to-br from-curator-primary to-curator-primary-container font-semibold text-curator-on-primary shadow-[0_4px_14px_0_rgba(0,30,64,0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,30,64,0.2)]"
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
                        : "border-b-2 border-transparent pb-2 text-sm font-medium text-curator-on-surface-variant transition hover:text-curator-primary"
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
            enablePagination
            headRowClassName="border-curator-outline-variant/10 bg-curator-surface hover:bg-curator-surface"
            headCellClassName={() => thBase}
            bodyRowClassName="group border-curator-outline-variant/10 hover:bg-curator-surface-container-low"
            bodyCellClassName={(colId) => {
              const base = `${tdBase} text-sm`;
              return colId === "actions" ? `${base} text-right` : base;
            }}
            paginationClassName="border-t border-curator-outline-variant/10 bg-curator-surface-container-lowest px-4 py-4"
          />
        </CardContent>
      </CuratorCard>
    </div>
  );
}
