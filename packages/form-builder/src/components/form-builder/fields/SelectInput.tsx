import type { SelectOption } from "../../../lib/types.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

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
  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((o) => !o.disabled)
            .map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                {option.description && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}
