import { useMemo, useCallback } from "react";
import type { SelectOption } from "../../../lib/types.js";
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@repo/ui/components/combobox";

export interface MultiSelectInputProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  errorText?: string;
  maxItems?: number;
}

export function MultiSelectInput({
  options,
  value,
  onChange,
  disabled,
  placeholder = "Select...",
  errorText,
  maxItems,
}: MultiSelectInputProps) {
  const selectableOptions = useMemo(
    () => options.filter((o) => !o.disabled),
    [options],
  );

  const valueSet = useMemo(() => new Set(value), [value]);

  const comboboxValue = useMemo(
    () => selectableOptions.filter((o) => valueSet.has(o.value)),
    [selectableOptions, valueSet],
  );

  const handleValueChange = useCallback(
    (newValue: SelectOption[]) => {
      if (maxItems && newValue.length > maxItems) return;
      onChange(newValue.map((o) => o.value));
    },
    [maxItems, onChange],
  );

  const atLimit = maxItems !== undefined && value.length >= maxItems;

  return (
    <div className="space-y-2">
      <Combobox
        multiple
        items={selectableOptions}
        value={comboboxValue}
        onValueChange={handleValueChange}
        itemToStringValue={(option: SelectOption) => option.label}
        disabled={disabled}
      >
        <ComboboxChips aria-invalid={!!errorText || undefined}>
          <ComboboxValue>
            {comboboxValue.map((opt) => (
              <ComboboxChip key={opt.value}>
                {opt.label}
              </ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput placeholder={placeholder} />
        </ComboboxChips>
        <ComboboxContent side="bottom" align="start">
          {maxItems !== undefined && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {value.length}/{maxItems} selected
            </div>
          )}
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(option: SelectOption) => (
              <ComboboxItem
                key={option.value}
                value={option.label}
                disabled={atLimit && !valueSet.has(option.value)}
              >
                <span>{option.label}</span>
                {option.description && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}