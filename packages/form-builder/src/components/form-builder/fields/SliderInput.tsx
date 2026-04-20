import { Slider } from "@repo/ui/components/slider";

export interface SliderInputProps {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  errorText?: string;
}

export function SliderInput({
  value,
  onChange,
  disabled,
  min = 0,
  max = 100,
  step = 1,
  errorText,
}: SliderInputProps) {
  const sliderValue = value ?? min;
  return (
    <div className="space-y-3">
      <Slider
        min={min}
        max={max}
        step={step}
        value={[sliderValue]}
        onValueChange={(vals) => onChange(vals[0]!)}
        disabled={disabled}
      />
      <span className="text-sm text-muted-foreground">{sliderValue}</span>
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}
