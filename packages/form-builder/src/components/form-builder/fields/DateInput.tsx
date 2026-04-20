import { Input } from "@repo/ui/components/input";
import { format } from "date-fns";

export interface DateInputProps {
  value?: Date | string | number;
  onChange: (value: Date | undefined) => void;
  disabled?: boolean;
  variant?: "date" | "datetime";
  errorText?: string;
}

export function DateInput({
  value,
  onChange,
  disabled,
  variant = "date",
  errorText,
}: DateInputProps) {
  const dateValue = value ? new Date(value) : null;
  const displayValue = dateValue
    ? variant === "datetime"
      ? format(dateValue, "yyyy-MM-dd'T'HH:mm")
      : format(dateValue, "yyyy-MM-dd")
    : "";

  return (
    <div className="space-y-2">
      <Input
        type={variant === "datetime" ? "datetime-local" : "date"}
        value={displayValue}
        onChange={(e) =>
          onChange(e.target.value ? new Date(e.target.value) : undefined)
        }
        disabled={disabled}
      />
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}
