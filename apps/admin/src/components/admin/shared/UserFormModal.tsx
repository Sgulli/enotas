"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@repo/ui/components/dialog";
import { FormBuilder } from "@repo/form-builder";
import { Loader2 } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { toJsonSchema } from "#/lib/to-json-schema";
import * as z from "zod";

const userSchema = z.object({
  name: z.string().min(1).meta({ title: "Name" }),
  email: z.email().meta({ title: "Email" }),
  role: z.string().meta({ title: "Role" }),
  status: z.string().default("active").meta({ title: "Status" }),
});

const userFormSchema = toJsonSchema(userSchema);

const dialogSurface =
  "font-curator border-curator-outline-variant/20 bg-curator-surface-container-lowest text-curator-on-surface shadow-[0_20px_40px_-15px_rgba(0,30,64,0.12)] ring-1 ring-curator-outline-variant/10";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason?: string | null;
  banExpires: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export function UserFormModal({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banReason, setBanReason] = useState<string>(user?.banReason ?? "");
  const [showBanReason, setShowBanReason] = useState(user?.banned ?? false);
  const isEditing = !!user;

  useEffect(() => {
    setBanReason(user?.banReason ?? "");
    setShowBanReason(user?.banned ?? false);
  }, [user]);

  const defaultValues = useMemo(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "customer",
      status: user?.banned ? "banned" : "active",
    }),
    [user],
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...values,
        banned: values.status === "banned",
        banReason: values.status === "banned" ? banReason || null : null,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          dialogSurface,
          "sm:max-w-md [&_[data-slot=dialog-close]]:text-curator-on-surface-variant [&_[data-slot=dialog-close]]:hover:bg-curator-surface-container-low",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-curator-on-surface">
            {isEditing ? "Edit User" : "Create User"}
          </DialogTitle>
          <DialogDescription className="text-curator-on-surface-variant">
            {isEditing
              ? "Update the user's information and permissions."
              : "Add a new user to the platform."}
          </DialogDescription>
        </DialogHeader>

        <FormBuilder
          schema={userFormSchema}
          fields={{
            name: { placeholder: "John Doe" },
            email: { placeholder: "john@example.com" },
            role: {
              options: [
                { value: "admin", label: "Admin" },
                { value: "editor", label: "Editor" },
                { value: "customer", label: "Customer" },
              ],
            },
            status: {
              options: [
                { value: "active", label: "Active" },
                { value: "banned", label: "Banned" },
              ],
            },
          }}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          disabled={isSubmitting}
          className="space-y-5"
          onFieldChange={(name, value) => {
            if (name === "status") {
              setShowBanReason(value === "banned");
            }
          }}
          footer={
            <div className="space-y-5">
              <div
                className={`space-y-2 overflow-hidden transition-all duration-200 ${
                  showBanReason
                    ? "max-h-32 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <Label
                  htmlFor="banReason"
                  className="text-sm font-medium text-curator-on-surface"
                >
                  Ban Reason
                  <span className="ml-1 text-xs font-normal text-curator-on-surface-variant">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="banReason"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Reason for banning this user"
                  className="h-10 border-curator-outline-variant/30 bg-curator-surface-container-low text-curator-on-surface placeholder:text-curator-on-surface-variant/60"
                />
              </div>

              <DialogFooter
                showCloseButton={false}
                className="border-curator-outline-variant/10 bg-curator-surface-container-low/70"
              >
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="cursor-pointer border-curator-outline-variant/35 bg-curator-surface-container-lowest text-curator-on-surface hover:bg-curator-surface-container-low"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer bg-gradient-to-br from-curator-primary to-curator-primary-container text-curator-on-primary shadow-[0_4px_12px_-4px_rgba(0,30,64,0.35)] hover:opacity-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Save Changes"
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </div>
          }
        />
      </DialogContent>
    </Dialog>
  );
}