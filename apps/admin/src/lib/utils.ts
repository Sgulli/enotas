type FilterOperator =
  | "eq"
  | "in"
  | "contains"
  | "starts_with"
  | "ends_with"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "not_in"
  | undefined;

export function buildFilterQuery(
  field: string,
  operator: FilterOperator,
  value: string,
) {
  return {
    filterValue: value,
    filterField: field,
    filterOperator: operator,
  } as const;
}
