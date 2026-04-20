import { Input } from "@repo/ui/components/input";

export interface NumberInputProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  step?: number;
  errorText?: string;
}

export function NumberInput({
  value,
  onChange,
  disabled,
  placeholder,
  step,
  errorText,
}: NumberInputProps) {
  return (
    <div className="space-y-2">
      <Input
        type="number"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? undefined : Number(e.target.value))
        }
        disabled={disabled}
        placeholder={placeholder}
        step={step}
      />
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}
