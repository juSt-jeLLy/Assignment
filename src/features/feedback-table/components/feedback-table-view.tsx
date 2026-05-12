import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { FeedbackRecord } from "@/features/feedback";
import { useFeedbackRecords } from "@/features/feedback";
import { ExportCsvButton } from "@/features/shared/export";
import { FilterSelect, PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/components/dashboard/Skeleton";
import {
  useGlobalSearch,
  useSetGlobalSearch,
  useDepartmentFilter,
  useSetDepartment,
  useSentimentFilter,
  useSetSentiment,
  useRatingFilter,
  useSetRating,
  useResetFilters,
} from "@/store";

/** Renders searchable, filterable, sortable, paginated feedback table. */
export function FeedbackTableView(): React.JSX.Element {
  const { data, isLoading, isError } = useFeedbackRecords();
  const [sorting, setSorting] = useState<SortingState>([]);

  // ── Zustand filters — shared globally, survive navigation ────────────
  const globalSearch = useGlobalSearch();
  const setGlobalSearch = useSetGlobalSearch();
  const department = useDepartmentFilter();
  const setDepartment = useSetDepartment();
  const sentiment = useSentimentFilter();
  const setSentiment = useSetSentiment();
  const rating = useRatingFilter();
  const setRating = useSetRating();
  const resetFilters = useResetFilters();
  // ─────────────────────────────────────────────────────────────────────

  const records = useMemo(() => data ?? [], [data]);

  const columns = useMemo<ColumnDef<FeedbackRecord>[]>(
    () => [
      { accessorKey: "patientName", header: "Patient Name" },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "doctor", header: "Doctor" },
      { accessorKey: "rating", header: "Rating" },
      {
        accessorKey: "feedback",
        header: "Feedback Message",
        cell: ({ row }) => <span>{`${String(row.original.feedback).slice(0, 55)}...`}</span>,
      },
      { accessorKey: "sentiment", header: "Sentiment" },
      { accessorKey: "date", header: "Date" },
    ],
    [],
  );

  const filteredData = useMemo(
    () =>
      records
        .filter((row) => (department === "All" ? true : row.department === department))
        .filter((row) => (sentiment === "All" ? true : row.sentiment === sentiment))
        .filter((row) => (rating === "All" ? true : row.rating === Number(rating)))
        .filter((row) => {
          if (globalSearch.trim() === "") return true;
          const q = globalSearch.toLowerCase();
          return (
            row.patientName.toLowerCase().includes(q) ||
            row.doctor.toLowerCase().includes(q) ||
            row.department.toLowerCase().includes(q) ||
            row.feedback.toLowerCase().includes(q)
          );
        }),
    [records, department, sentiment, rating, globalSearch],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(records.map((entry) => entry.department)))],
    [records],
  );

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError || !data)
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load feedback table.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Feedback Table"
          description="Detailed feedback records with search, sorting, filters, and pagination."
        />
        <ExportCsvButton fileName="feedback-table-filtered.csv" rows={filteredData} />
      </div>

      <section className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-ui-label text-xs font-semibold tracking-wide">Global Search</span>
          <input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            placeholder="Search by name, doctor, department…"
          />
        </label>
        <FilterSelect
          label="Department"
          options={departments}
          value={department}
          onChange={setDepartment}
        />
        <FilterSelect
          label="Sentiment"
          options={["All", "Positive", "Neutral", "Negative"]}
          value={sentiment}
          onChange={(v) => setSentiment(v as typeof sentiment)}
        />
        <FilterSelect
          label="Rating"
          options={["All", "1", "2", "3", "4", "5"]}
          value={rating}
          onChange={(v) => setRating(v as typeof rating)}
        />
      </section>

      {/* Active filter indicator + reset */}
      {(department !== "All" || sentiment !== "All" || rating !== "All" || globalSearch) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Filters active —</span>
          <button
            onClick={resetFilters}
            className="text-primary underline-offset-2 hover:underline"
          >
            Reset all
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-ui-label-soft">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-ui-label border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em]"
                  >
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className="inline-flex items-center gap-1.5"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5 text-primary" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ArrowDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-border/60">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} —{" "}
          {filteredData.length} results
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-md border border-border px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-md border border-border px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
