import { Textarea } from "@repo/ui/components/textarea";

export interface TextareaInputProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  errorText?: string;
}

export function TextareaInput({
  value = "",
  onChange,
  disabled,
  placeholder,
  rows = 4,
  errorText,
}: TextareaInputProps) {
  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
      />
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}
