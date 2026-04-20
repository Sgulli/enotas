"use client";

import { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import type { FieldDefinition } from "../../lib/types.js";
import { FieldInputs } from "./FieldInputs.js";
import type { JSONSchema } from "../../lib/json-schema.js";
import { JSONSchemaToFields } from "../../lib/json-schema.js";
import type { FormUiFieldOptions } from "../../lib/ui-schema.js";
import { applyUiToFields } from "../../lib/ui-schema.js";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

export type FormBuilderProps = {
  schema: JSONSchema;
  layout?: "single" | "two-column" | "three-column";
  order?: readonly string[];
  fields?: Record<string, FormUiFieldOptions>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
  defaultValues?: Partial<Record<string, unknown>>;
  submitLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  className?: string;
  footer?: React.ReactNode;
  onFieldChange?: (name: string, value: unknown) => void;
};

function isEmpty(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function buildRequiredValidator(field: FieldDefinition) {
  return ({ value }: { value: unknown }) => {
    if (field.required && isEmpty(value)) return "Required";
    return undefined;
  };
}

export function FormBuilder({
  schema,
  layout = "single",
  order,
  fields: fieldOptions,
  onSubmit,
  onCancel,
  defaultValues,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  disabled,
  className,
  footer,
  onFieldChange,
}: Readonly<FormBuilderProps>) {
  const baseFields = useMemo(() => JSONSchemaToFields(schema), [schema]);

  const fields = useMemo(
    () => applyUiToFields(baseFields, { layout, order, fields: fieldOptions }),
    [baseFields, layout, order, fieldOptions],
  );

  let layoutClass = "space-y-4";
  if (layout === "two-column") {
    layoutClass = "grid grid-cols-1 gap-4 sm:grid-cols-2";
  } else if (layout === "three-column") {
    layoutClass = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
  }

  const form = useForm({
    defaultValues: defaultValues ?? {},
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {schema.title && (
        <h2 className="text-lg font-semibold">{schema.title}</h2>
      )}
      {schema.description && (
        <p className="text-sm text-muted-foreground">{schema.description}</p>
      )}

      <div className={`${layoutClass} ${className ?? ""}`}>
        {fields
          .filter((f) => !f.hidden)
          .map((field) => (
            <form.Field
              key={field.name}
              name={field.name}
              validators={{
                onChange: buildRequiredValidator(field),
                onBlur: buildRequiredValidator(field),
              }}
            >
              {(f) => (
                <div className={field.className}>
                  <Label
                    htmlFor={field.name}
                    className="mb-1.5 block text-sm font-medium text-curator-on-surface"
                  >
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-curator-error">*</span>
                    )}
                  </Label>
                  {field.description && (
                    <p className="mb-2 text-xs text-curator-on-surface-variant">
                      {field.description}
                    </p>
                  )}
                  <FieldInputs
                    field={field}
                    value={f.state.value}
                    onChange={(v) => {
                      f.handleChange(v);
                      onFieldChange?.(field.name, v);
                    }}
                    disabled={disabled}
                    errors={f.state.meta.errors as string[]}
                  />
                </div>
              )}
            </form.Field>
          ))}
      </div>

      {footer ?? (
        <div className="mt-6 flex items-center gap-2">
          <Button type="submit" disabled={disabled}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={disabled}
            >
              {cancelLabel}
            </Button>
          )}
        </div>
      )}
    </form>
  );
}
