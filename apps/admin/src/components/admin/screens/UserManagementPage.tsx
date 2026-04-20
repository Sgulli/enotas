import { useState, useCallback } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { useLoaderData, useRouter } from "@tanstack/react-router";
import {
	Button,
	CardContent,
	CardHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import {
	AdminSearchField,
	AdminTabList,
	CuratorCard,
} from "#/components/admin/blocks";
import { PageHeader } from "../shared/PageHeader";
import { StatusBadge } from "../shared/StatusBadge";
import { UserFormModal } from "../shared/UserFormModal";
import type { User } from "../shared/UserFormModal";
import { createUser, updateUser, deleteUser } from "#/server/users";

const thBase =
	"py-4 pl-4 pr-4 text-xs font-medium uppercase tracking-widest text-curator-on-surface-variant";
const tdBase = "py-4 pl-4 pr-4 align-top";

const DIRECTORY_COLUMNS: {
	id: string;
	label: string;
	align: "left" | "right";
}[] = [
	{ id: "user", label: "User", align: "left" },
	{ id: "role", label: "Role", align: "left" },
	{ id: "status", label: "Status", align: "left" },
	{ id: "date", label: "Date Joined", align: "left" },
	{ id: "actions", label: "Actions", align: "right" },
];

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
						banReason: values.banned
							? editingUser.banReason
							: null,
					},
				});
			} else {
				await createUser({ data: values });
			}
			router.invalidate();
		},
		[editingUser, router],
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
						<AdminSearchField
							placeholder="Filter admins…"
							type="search"
						/>
						<Button
							type="button"
							className="bg-gradient-to-br from-curator-primary to-curator-primary-container text-curator-on-primary shadow-[0_4px_12px_-4px_rgba(0,30,64,0.4)] hover:opacity-95"
							onClick={handleCreate}
						>
							<UserPlus />
							Invite User
						</Button>
					</div>
				</CardHeader>
				<CardContent className="px-0 pb-0 pt-0">
					<Table>
						<TableHeader>
							<TableRow className="border-curator-outline-variant/10 hover:bg-transparent">
								{DIRECTORY_COLUMNS.map((col) => (
									<TableHead
										key={col.id}
										className={cn(
											thBase,
											col.align === "right"
												? "text-right"
												: "text-left",
										)}
									>
										{col.label}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow
									key={user.id}
									className="group border-curator-outline-variant/10 hover:bg-curator-surface-container-low/50"
								>
									<TableCell className={cn(tdBase, "text-left")}>
										<div className="flex items-start gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-curator-primary-fixed text-xs font-bold text-curator-primary-fixed-dim">
												{user.name
													.split(" ")
													.map((p: string) => p[0])
													.join("")}
											</div>
											<div className="min-w-0 text-left">
												<p className="font-semibold text-curator-on-surface">
													{user.name}
												</p>
												<p className="text-xs text-curator-on-surface-variant">
													{user.email}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell
										className={cn(
											tdBase,
											"text-left text-curator-on-surface-variant",
										)}
									>
										{user.role ?? "User"}
									</TableCell>
									<TableCell className={cn(tdBase, "text-left")}>
										<StatusBadge
											variant={
												user.banned
													? "user-inactive"
													: "user-active"
											}
											label={user.banned ? "Banned" : "Active"}
										/>
									</TableCell>
									<TableCell
										className={cn(
											tdBase,
											"text-left tabular-nums text-curator-on-surface-variant",
										)}
									>
										{new Date(user.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell className={cn(tdBase, "text-right")}>
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
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
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
