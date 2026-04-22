import { type AccessorFn, type ColumnHelper } from "@tanstack/react-table";
import { StatusBadge } from "#/components/admin/shared/StatusBadge";

function dateColumn<TData>(
  helper: ColumnHelper<TData>,
  accessor: AccessorFn<TData, Date> | (keyof TData & string),
  header: string,
) {
  return helper.accessor(accessor as any, {
    header,
    cell: (info: any) => (
      <span className="tabular-nums text-curator-on-surface-variant">
        {new Date(info.getValue()).toLocaleDateString()}
      </span>
    ),
  });
}

function booleanStatusColumn<TData>(
  helper: ColumnHelper<TData>,
  accessor: AccessorFn<TData, boolean> | (keyof TData & string),
  header: string,
  opts?: {
    trueVariant?: any;
    falseVariant?: any;
    trueLabel?: string;
    falseLabel?: string;
  },
) {
  const tv = opts?.trueVariant ?? "user-inactive";
  const fv = opts?.falseVariant ?? "user-active";
  const tl = opts?.trueLabel ?? "Yes";
  const fl = opts?.falseLabel ?? "No";
  return helper.accessor(accessor as any, {
    header,
    cell: (info) => {
      const val = info.getValue();
      return <StatusBadge variant={val ? tv : fv} label={val ? tl : fl} />;
    },
  });
}

function mapStatusColumn<TData, TValue>(
  helper: ColumnHelper<TData>,
  accessor: AccessorFn<TData, TValue> | (keyof TData & string),
  header: string,
  statusMap: Record<string, any>,
  labelMap: Record<string, string>,
  fallback?: any,
) {
  return helper.accessor(accessor as any, {
    header,
    cell: (info) => {
      const val = info.getValue() as string;
      return (
        <StatusBadge
          variant={statusMap[val] ?? fallback ?? "user-active"}
          label={labelMap[val] ?? val}
        />
      );
    },
  });
}

function avatarNameColumn<TData>(
  helper: ColumnHelper<TData>,
  nameAccessor: AccessorFn<TData, string> | (keyof TData & string),
  emailAccessor: keyof TData & string,
  header: string,
) {
  return helper.accessor(nameAccessor as any, {
    header,
    cell: (info: any) => {
      const name = info.getValue() as string;
      const email = info.row.original[emailAccessor] as string;
      const initials = name
        .split(" ")
        .map((p: string) => p[0])
        .join("");
      return (
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-curator-primary-fixed text-xs font-bold text-curator-primary-fixed-dim">
            {initials}
          </div>
          <div className="min-w-0 text-left">
            <p className="font-semibold text-curator-on-surface">{name}</p>
            <p className="text-xs text-curator-on-surface-variant">{email}</p>
          </div>
        </div>
      );
    },
  });
}

function currencyColumn<TData extends Record<string, any>>(
  helper: ColumnHelper<TData>,
  accessor: any,
  header: string,
) {
  return helper.accessor(accessor, {
    header,
    cell: (info: any) => (
      <span className="font-semibold text-curator-primary">
        ${Number(info.getValue()).toFixed(2)}
      </span>
    ),
  });
}

const columnUtils = {
  date: dateColumn,
  booleanStatus: booleanStatusColumn,
  mapStatus: mapStatusColumn,
  avatarName: avatarNameColumn,
  currency: currencyColumn,
} as const;

export { columnUtils };
