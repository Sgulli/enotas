import { createFileRoute } from "@tanstack/react-router";
import { LibraryPage } from "#/components/admin/screens/LibraryPage";

export const Route = createFileRoute("/_admin/library")({
  component: LibraryPage,
});
