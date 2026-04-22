import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getUsers } from "#/server/users";
import { UserManagementPage } from "#/components/admin/screens/UserManagementPage";

const searchSchema = z.object({
  page: z.number().int().positive().default(1).catch(1),
  pageSize: z.number().int().positive().max(100).default(20).catch(20),
  role: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_admin/users")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getUsers({ data: deps }),
  component: UserManagementPage,
});
