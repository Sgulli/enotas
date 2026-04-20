"use client";

import type { FieldDefinition, SelectOption } from "../../lib/types.js";
import { RichTextEditor } from "./RichTextEditor.js";
import { format } from "date-fns";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import {
  Input
} from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Switch } from "@repo/ui/components/switch";
import { Slider } from "@repo/ui/components/slider";
import { Badge } from "@repo/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

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

interface SelectInputProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  placeholder?: string;
  errorText?: string;
}

function SelectInput({
  options,
  value,
  onChange,
  disabled,
  placeholder = "Select...",
  errorText,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
    });
  }, []);

  useLayoutEffect(() => {
    if (open) {
      updatePosition();
      const onScroll = () => updatePosition();
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
      };
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="space-y-2">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-curator-outline-variant/30 bg-curator-surface-container-lowest px-3 py-2 text-sm text-curator-on-surface ring-offset-background transition-colors hover:bg-curator-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-curator-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selected ? "" : "text-curator-on-surface-variant/60"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="overflow-hidden rounded-lg border border-curator-outline-variant/20 bg-curator-surface-container-lowest py-1 shadow-lg"
          >
            {options
              .filter((o) => !o.disabled)
              .map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-left text-sm text-curator-on-surface transition-colors hover:bg-curator-surface-container"
                >
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && (
                    <CheckIcon className="ml-2 h-4 w-4 shrink-0 text-curator-primary" />
                  )}
                </button>
              ))}
          </div>,
          document.body,
        )}
      {errorText && <p className="text-sm text-curator-error">{errorText}</p>}
    </div>
  );
}

interface MultiSelectInputProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: unknown) => void;
  disabled?: boolean;
  placeholder?: string;
  errorText?: string;
}

function MultiSelectInput({
  options,
  value,
  onChange,
  disabled,
  placeholder = "Select...",
  errorText,
}: MultiSelectInputProps) {
  const [open, setOpen] = useState(false);
  const selectedOptions = options.filter((o) => value.includes(o.value));

  const toggleValue = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className="flex min-h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex flex-wrap items-center gap-1">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedOptions.map((opt) => (
                <Badge key={opt.value} variant="secondary">
                  {opt.label}
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
            {options
              .filter((o) => !o.disabled)
              .map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleValue(option.value)}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="mr-2 flex h-4 w-4 items-center justify-center">
                    {value.includes(option.value) && (
                      <CheckIcon className="h-4 w-4" />
                    )}
                  </span>
                  {option.label}
                </button>
              ))}
          </div>
        )}
      </div>
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}
