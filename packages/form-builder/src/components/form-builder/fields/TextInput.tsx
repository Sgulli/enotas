import { Input } from "@repo/ui/components/input";

export interface TextInputProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  errorText?: string;
  inputType?: "text" | "email" | "url" | "tel" | "color" | "file";
  accept?: string;
}

export function TextInput({
  value = "",
  onChange,
  disabled,
  placeholder,
  errorText,
  inputType = "text",
  accept,
}: TextInputProps) {
  if (inputType === "file") {
    return (
      <div className="space-y-2">
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file.name);
          }}
          disabled={disabled}
          accept={accept}
        />
        {errorText && <p className="text-sm text-destructive">{errorText}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={inputType === "color" ? "h-10 w-full p-1" : undefined}
      />
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}
