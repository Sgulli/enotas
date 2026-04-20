import { Switch } from "@repo/ui/components/switch";

export interface BooleanInputProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  variant?: "checkbox" | "switch";
  errorText?: string;
}

export function BooleanInput({
  value,
  onChange,
  disabled,
  variant = "checkbox",
  errorText,
}: BooleanInputProps) {
  if (variant === "switch") {
    return (
      <div className="flex items-center gap-2">
        <Switch
          checked={!!value}
          onCheckedChange={(checked) => onChange(checked)}
          disabled={disabled}
        />
        {errorText && <p className="text-sm text-destructive">{errorText}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 rounded border-input accent-primary"
      />
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}
