import { useState } from "react";
import type { SelectOption } from "../../../lib/types.js";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";

export interface MultiSelectInputProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  errorText?: string;
}

export function MultiSelectInput({
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
