import { createFileRoute } from "@tanstack/react-router";
import { getUsers } from "#/server/users";
import { UserManagementPage } from "#/components/admin/screens/UserManagementPage";

export const Route = createFileRoute("/_admin/users")({
  loader: async () => {
    const users = await getUsers({ data: { role: "admin" } });
    return { users };
  },
  component: UserManagementPage,
});
