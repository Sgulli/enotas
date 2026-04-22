import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "#/server/auth";
import { isAuthError } from "#/lib/errors";
import { AdminLayout } from "#/components/admin/layout/AdminLayout";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    if (!session) {
      throw redirect({
        to: "/signin",
        search: { redirect: location.href },
      });
    }
    return { user: session.user };
  },
  onError: ({ error }) => {
    if (isAuthError(error)) {
      throw redirect({
        to: "/signin",
        search: { redirect: globalThis.location.href },
      });
    }
  },
  component: AdminLayout,
});
