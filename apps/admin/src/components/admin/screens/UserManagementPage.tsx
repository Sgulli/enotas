import { useState, useCallback } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import {
  useLoaderData,
  useSearch,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
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
import {
  AdminSearchField,
  AdminTabList,
  CuratorCard,
} from "#/components/admin/blocks";
import { PageHeader } from "../shared/PageHeader";
import { UserFormModal } from "../shared/UserFormModal";
import type { User } from "../shared/UserFormModal";
import { createUser, updateUser, deleteUser } from "#/server/users";
import { columnUtils } from "#/lib/table-utils";

const ROLE_TABS = ["All", "Admin", "Editor", "User"] as const;
const ROLE_MAP: Record<string, string | undefined> = {
  All: undefined,
  Admin: "admin",
  Editor: "editor",
  User: "user",
};

const thBase =
  "py-4 pl-4 pr-4 text-xs font-medium uppercase tracking-widest text-curator-on-surface-variant";
const tdBase = "py-4 pl-4 pr-4 align-top";

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

export function UserManagementPage() {
  const { users, total, page, pageSize } = useLoaderData({
    from: "/_admin/users",
  });
  const search = useSearch({ from: "/_admin/users" });
  const navigate = useNavigate();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const roleParam = search.role ?? "";
  const activeTab = ROLE_TABS.findIndex(
    (tab) => (ROLE_MAP[tab] ?? "") === roleParam,
  );

  const setPage = useCallback(
    (p: number) => {
      void navigate({
        to: "/users",
        search: (prev) => ({ ...prev, page: p }),
      });
    },
    [navigate],
  );

  const setRole = useCallback(
    (role: string | undefined) => {
      void navigate({
        to: "/users",
        search: (prev) => ({ ...prev, page: 1, role }),
      });
    },
    [navigate],
  );

  const handleCreate = useCallback(() => {
    setEditingUser(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (userId: string) => {
      if (!confirm("Are you sure you want to delete this user?")) return;
      await deleteUser({ data: { id: userId } });
      router.invalidate();
    },
    [router],
  );

  const handleSubmit = useCallback(
    async (data: Pick<User, "name" | "email" | "role">) => {
      const { role, ...rest } = data;
      if (editingUser) {
        await updateUser({
          data: {
            id: editingUser.id,
            ...rest,
          },
        });
      } else {
        await createUser({ data: { ...rest, role: role as "admin" | "user" } });
      }
      router.invalidate();
    },
    [editingUser, router],
  );

  const columns = useColumns<User>(
    (h) => [
      columnUtils.avatarName(h, "name", "email", "User"),
      h.accessor("role", {
        header: "Role",
        cell: (info) => (
          <span className="text-curator-on-surface-variant">
            {info.getValue() ?? "User"}
          </span>
        ),
      }),
      columnUtils.booleanStatus(h, "banned", "Status", {
        trueVariant: "user-inactive",
        falseVariant: "user-active",
        trueLabel: "Banned",
        falseLabel: "Active",
      }),
      columnUtils.date(h, "createdAt", "Date Joined"),
      h.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-curator-secondary hover:bg-curator-surface-container hover:text-curator-primary"
                aria-label="Edit"
                onClick={() => handleEdit(user)}
              >
                <Pencil />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-curator-secondary hover:bg-curator-error-container/50 hover:text-curator-error"
                aria-label="Delete"
                onClick={() => handleDelete(user.id)}
              >
                <Trash2 />
              </Button>
            </div>
          );
        },
      }),
    ],
    [handleEdit, handleDelete],
  );

  return (
    <div className="mx-auto max-w-6xl p-8 md:p-12">
      <PageHeader
        title="User Directory"
        description="Manage platform access, roles, and privileges across the institution."
      />

      <AdminTabList
        tabs={[...ROLE_TABS]}
        activeIndex={activeTab === -1 ? 0 : activeTab}
        onChange={(i) => {
          const role = ROLE_MAP[ROLE_TABS[i]];
          setRole(role);
        }}
      />

      <CuratorCard className="gap-0 py-0">
        <CardHeader className="border-b border-curator-outline-variant/10 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <AdminSearchField placeholder="Filter admins…" type="search" />
            <Button
              type="button"
              className="bg-gradient-to-br from-curator-primary to-curator-primary-container text-curator-on-primary shadow-[0_4px_12px_-4px_rgba(0,30,64,0.4)] hover:opacity-95 cursor-pointer"
              onClick={handleCreate}
            >
              <UserPlus />
              Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <DataTable
            columns={columns}
            data={users}
            enableFiltering
            headRowClassName="border-curator-outline-variant/10 hover:bg-transparent"
            headCellClassName={(id) => {
              const base = `${thBase} ${tdBase}`;
              return id === "actions"
                ? `${base} text-right`
                : `${base} text-left`;
            }}
            bodyRowClassName="group border-curator-outline-variant/10 hover:bg-curator-surface-container-low/50"
            bodyCellClassName={() => `${tdBase}`}
          />
        </CardContent>
      </CuratorCard>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-2">
          <span className="text-xs font-medium text-curator-on-surface-variant">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of{" "}
            {total}
          </span>
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
              {(() => {
                const { start, end } = getVisiblePageRange(page, totalPages);
                const items = [];
                if (start > 1) {
                  items.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        onClick={() => setPage(1)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>,
                  );
                  if (start > 2) {
                    items.push(
                      <PaginationItem key="start-ellipsis">
                        <PaginationEllipsis />
                      </PaginationItem>,
                    );
                  }
                }
                for (let p = start; p <= end; p++) {
                  items.push(
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>,
                  );
                }
                if (end < totalPages) {
                  if (end < totalPages - 1) {
                    items.push(
                      <PaginationItem key="end-ellipsis">
                        <PaginationEllipsis />
                      </PaginationItem>,
                    );
                  }
                  items.push(
                    <PaginationItem key={totalPages}>
                      <PaginationLink
                        onClick={() => setPage(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>,
                  );
                }
                return items;
              })()}
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
        </div>
      )}

      <UserFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={editingUser}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
