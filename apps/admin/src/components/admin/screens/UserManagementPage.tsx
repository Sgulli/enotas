import { useState, useCallback } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { useLoaderData, useRouter } from "@tanstack/react-router";
import {
  Button,
  CardContent,
  CardHeader,
  DataTable,
  useColumns,
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

const thBase =
  "py-4 pl-4 pr-4 text-xs font-medium uppercase tracking-widest text-curator-on-surface-variant";
const tdBase = "py-4 pl-4 pr-4 align-top";

export function UserManagementPage() {
  const { users } = useLoaderData({ from: "/_admin/users" });
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
    async (rawValues: Record<string, unknown>) => {
      const values = rawValues as {
        name: string;
        email: string;
        role: string | null;
        banned: boolean | null;
      };
      if (editingUser) {
        await updateUser({
          data: {
            id: editingUser.id,
            ...values,
            banReason: values.banned ? editingUser.banReason : null,
          },
        });
      } else {
        await createUser({ data: values });
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

      <AdminTabList tabs={["Admin", "Editors", "Customers"]} />

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

      <UserFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={editingUser}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
