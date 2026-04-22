"use client";

import type { FieldDefinition } from "../../lib/types.js";
import { RichTextEditor } from "./RichTextEditor.js";
import { format } from "date-fns";
import {
  Input
} from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Switch } from "@repo/ui/components/switch";
import { Slider } from "@repo/ui/components/slider";
import { SelectInput } from "./fields/SelectInput.js";
import { MultiSelectInput } from "./fields/MultiSelectInput.js";

export interface FieldInputsProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: string[];
}

export function FieldInputs({
  field,
  value,
  onChange,
  disabled,
  errors,
}: FieldInputsProps) {
  const errorText = errors?.[0];

  switch (field.type) {
    case "string":
    case "phone":
      return (
        <div className="space-y-2">
          <Input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            placeholder={field.placeholder}
            className="h-10 border-curator-outline-variant/30 bg-curator-surface-container-lowest text-curator-on-surface placeholder:text-curator-on-surface-variant/50"
          />
          {errorText && <p className="text-sm text-curator-error">{errorText}</p>}
        </div>
      );

    case "color":
      return (
        <div className="space-y-2">
          <Input
            type="color"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            className="h-10 w-full p-1"
          />
          {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        </div>
      );

    case "email":
      return (
        <div className="space-y-2">
          <Input
            type="email"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            placeholder={field.placeholder}
            className="h-10 border-curator-outline-variant/30 bg-curator-surface-container-lowest text-curator-on-surface placeholder:text-curator-on-surface-variant/50"
          />
          {errorText && <p className="text-sm text-curator-error">{errorText}</p>}
        </div>
      );

    case "url":
      return (
        <div className="space-y-2">
          <Input
            type="url"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            placeholder={field.placeholder}
          />
          {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          <Input
            type="number"
            value={(value as number) ?? ""}
            onChange={(e) =>
              onChange(
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            disabled={disabled || field.disabled}
            placeholder={field.placeholder}
            step={field.validation?.step}
          />
          {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        </div>
      );

    case "slider": {
      const sliderValue = (value as number) ?? field.min ?? 0;
      return (
        <div className="space-y-3">
          <Slider
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={[sliderValue]}
            onValueChange={(vals) => onChange(vals[0])}
            disabled={disabled || field.disabled}
          />
          <span className="text-sm text-muted-foreground">{sliderValue}</span>
          {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        </div>
      );
    }

    case "boolean": {
      if (field.variant === "switch") {
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={!!value}
              onCheckedChange={(checked) => onChange(checked)}
              disabled={disabled || field.disabled}
              className="data-[state=checked]:bg-curator-primary"
            />
            {errorText && (
              <p className="text-sm text-curator-error">{errorText}</p>
            )}
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled || field.disabled}
            className="h-4 w-4 rounded border-curator-outline-variant accent-curator-primary"
          />
          {errorText && <p className="text-sm text-curator-error">{errorText}</p>}
        </div>
      );
    }

    case "date":
    case "datetime": {
      const dateValue = value
        ? new Date(value as string | number | Date)
        : null;
      const displayValue = dateValue
        ? field.type === "datetime"
          ? format(dateValue, "yyyy-MM-dd'T'HH:mm")
          : format(dateValue, "yyyy-MM-dd")
        : "";

      return (
        <div className="space-y-2">
          <Input
            type={field.type === "datetime" ? "datetime-local" : "date"}
            value={displayValue}
            onChange={(e) =>
              onChange(e.target.value ? new Date(e.target.value) : undefined)
            }
            disabled={disabled || field.disabled}
          />
          {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        </div>
      );
    }

    case "textarea":
      return (
        <div className="space-y-2">
          <Textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            placeholder={field.placeholder}
            rows={field.rows ?? 4}
          />
          {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        </div>
      );

    case "select":
      return (
        <SelectInput
          options={field.options}
          value={value as string}
          onChange={onChange}
          disabled={disabled || field.disabled}
          placeholder={field.placeholder}
          errorText={errorText}
        />
      );

    case "multiselect":
      return (
        <MultiSelectInput
          options={field.options}
          value={(value as string[]) ?? []}
          onChange={onChange}
          disabled={disabled || field.disabled}
          placeholder={field.placeholder}
          maxItems={field.maxItems}
          errorText={errorText}
        />
      );

    case "richtext":
      return (
        <div className="space-y-2">
          <RichTextEditor
            value={(value as string) ?? ""}
            onChange={onChange}
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
            toolbar={field.toolbar}
          />
          {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        </div>
      );

    case "file":
      return (
        <div className="space-y-2">
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(file);
            }}
            disabled={disabled || field.disabled}
            accept={
              (field as { validation?: { accept?: string } }).validation?.accept
            }
          />
          {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        </div>
      );

    default:
      return null;
  }
}
