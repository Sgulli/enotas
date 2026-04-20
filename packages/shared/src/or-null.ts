export function orNull<T>(value: T | null | undefined): T | null {
  return value ?? null;
}
