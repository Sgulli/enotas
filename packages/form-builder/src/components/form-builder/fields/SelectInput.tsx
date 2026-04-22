import { useMemo, useCallback } from "react";
import type { SelectOption } from "../../../lib/types.js";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/combobox";

export interface SelectInputProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  errorText?: string;
}

export function SelectInput({
  options,
  value,
  onChange,
  disabled,
  placeholder = "Select...",
  errorText,
}: SelectInputProps) {
  const selectableOptions = useMemo(
    () => options.filter((o) => !o.disabled),
    [options],
  );

  const selectedOption = useMemo(
    () => selectableOptions.find((o) => o.value === value) ?? null,
    [selectableOptions, value],
  );

  const handleValueChange = useCallback(
    (newValue: SelectOption | null) => {
      onChange(newValue?.value ?? "");
    },
    [onChange],
  );

  return (
    <div className="space-y-2">
      <Combobox
        items={selectableOptions}
        value={selectedOption}
        onValueChange={handleValueChange}
        itemToStringValue={(option: SelectOption) => option.label}
        disabled={disabled}
      >
        <ComboboxInput
          placeholder={placeholder}
          aria-invalid={!!errorText || undefined}
          showTrigger
          showClear={!!selectedOption}
        />
        <ComboboxContent side="bottom" align="start">
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(option: SelectOption) => (
              <ComboboxItem key={option.value} value={option.label}>
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