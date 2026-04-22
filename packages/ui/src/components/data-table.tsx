import type { DependencyList, ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type TableOptions,
  type ColumnHelper,
  createColumnHelper,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination.js";
import { cn } from "../lib/utils.js";

interface DataTableProps<TData> extends Omit<
  TableOptions<TData>,
  "getCoreRowModel"
> {
  toolbar?: ReactNode;
  footer?: ReactNode;
  tableClassName?: string;
  headRowClassName?: string;
  headCellClassName?: string | ((columnId: string) => string);
  bodyRowClassName?: string | ((rowId: string, index: number) => string);
  bodyCellClassName?: string | ((columnId: string) => string);
  emptyMessage?: ReactNode;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableFiltering?: boolean;
  pageSize?: number;
  paginationClassName?: string;
}

function useColumns<TData, TValue = any>(
  builder: (helper: ColumnHelper<TData>) => ColumnDef<TData, TValue>[],
  deps: DependencyList,
): ColumnDef<TData, TValue>[] {
  return useMemo(() => builder(createColumnHelper<TData>()), deps);
}

function DataTable<TData>({
  columns,
  data,
  toolbar,
  footer,
  tableClassName,
  headRowClassName,
  headCellClassName,
  bodyRowClassName,
  bodyCellClassName,
  emptyMessage = "No results.",
  enableSorting = false,
  enablePagination = false,
  enableFiltering = false,
  pageSize = 10,
  paginationClassName,
  ...rest
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: enablePagination ? { pagination: { pageSize } } : undefined,
    state: { sorting, columnFilters },
    ...rest,
  });

  function resolveClass(
    value: string | ((...args: string[]) => string) | undefined,
    ...args: string[]
  ): string | undefined {
    if (!value) return undefined;
    if (typeof value === "function") return value(...args);
    return value;
  }

  const resolveRowClass = (
    value: string | ((rowId: string, index: number) => string) | undefined,
    rowId: string,
    index: number,
  ): string | undefined => {
    if (!value) return undefined;
    if (typeof value === "function") return value(rowId, index);
    return value;
  };

  return (
    <div className={cn("space-y-0", tableClassName)}>
      {toolbar}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={headRowClassName}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={resolveClass(headCellClassName, header.id)}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, i) => (
              <TableRow
                key={row.id}
                className={resolveRowClass(bodyRowClassName, row.id, i)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={resolveClass(bodyCellClassName, cell.column.id)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {enablePagination && (
        <PaginationBar table={table} className={paginationClassName} />
      )}

      {footer}
    </div>
  );
}

interface PaginationBarProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  className?: string;
}

const VISIBLE_PAGES = 5;

function getVisiblePageRange(current: number, total: number) {
  if (total <= VISIBLE_PAGES) return { start: 0, end: total };
  const half = Math.floor(VISIBLE_PAGES / 2);
  let start = Math.max(0, current - half);
  const end = Math.min(total, start + VISIBLE_PAGES);
  if (end - start < VISIBLE_PAGES) start = Math.max(0, end - VISIBLE_PAGES);
  return { start, end };
}

function PaginationBar<TData>({ table, className }: PaginationBarProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const firstRow = pageIndex * pageSize + 1;
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const { start, end } = useMemo(
    () => getVisiblePageRange(pageIndex, pageCount),
    [pageIndex, pageCount],
  );

  return (
    <div
      className={cn("flex items-center justify-between px-4 py-3", className)}
    >
      <span className="text-xs font-medium text-muted-foreground">
        {firstRow}–{lastRow} of {totalRows}
      </span>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              className={
                !table.getCanPreviousPage()
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {start > 0 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {Array.from({ length: end - start }, (_, i) => {
            const page = start + i;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === pageIndex}
                  onClick={() => table.setPageIndex(page)}
                  className="cursor-pointer"
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {end < pageCount && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              className={
                !table.getCanNextPage()
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export { DataTable, useColumns };
export type { DataTableProps, ColumnDef, ColumnHelper };
