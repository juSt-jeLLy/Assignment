import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { DoctorPerformanceRow } from "@/features/feedback";
import { computeDoctorPerformance, useFeedbackRecords } from "@/features/feedback";
import { ExportCsvButton } from "@/features/shared/export";
import { FilterSelect, PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/components/dashboard/Skeleton";
import {
  useDoctorSearch,
  useSetDoctorSearch,
  useDoctorDepartmentFilter,
  useSetDoctorDepartment,
} from "@/store";

/** Renders sortable doctor ranking table with search and department filters. */
export function DoctorPerformanceView(): React.JSX.Element {
  const { data, isLoading, isError } = useFeedbackRecords();
  const [sorting, setSorting] = useState<SortingState>([{ id: "consultationRating", desc: true }]);
  const search = useDoctorSearch();
  const setSearch = useSetDoctorSearch();
  const departmentFilter = useDoctorDepartmentFilter();
  const setDepartmentFilter = useSetDoctorDepartment();
  const records = useMemo(() => data ?? [], [data]);
  const rows = useMemo(() => computeDoctorPerformance(records), [records]);
  const filteredRows = useMemo(
    () =>
      rows
        .filter((row) => (departmentFilter === "All" ? true : row.department === departmentFilter))
        .filter((row) => row.doctor.toLowerCase().includes(search.toLowerCase())),
    [rows, departmentFilter, search],
  );

  const columns = useMemo<ColumnDef<DoctorPerformanceRow>[]>(
    () => [
      { accessorKey: "doctor", header: "Doctor" },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "consultationRating", header: "Consultation Rating" },
      { accessorKey: "totalPatientsSeen", header: "Total Patients Seen" },
      { accessorKey: "complaintsReceived", header: "Complaints" },
      { accessorKey: "overallFeedbackScore", header: "Overall Feedback Score" },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((entry) => entry.department)))],
    [rows],
  );

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError || !data)
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load doctor performance.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Doctor Performance"
          description="Rankings by consultation quality, complaint rates, and feedback score."
        />
        <ExportCsvButton fileName="doctor-performance.csv" rows={filteredRows} />
      </div>
      <section className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-ui-label text-xs font-semibold tracking-wide">Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            placeholder="Search by doctor name"
          />
        </label>
        <FilterSelect
          label="Department"
          value={departmentFilter}
          options={departments}
          onChange={setDepartmentFilter}
        />
      </section>
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
    </div>
  );
}
