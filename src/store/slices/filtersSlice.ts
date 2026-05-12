export type SentimentFilter = "All" | "Positive" | "Neutral" | "Negative";
export type RatingFilter = "All" | "1" | "2" | "3" | "4" | "5";
export type StatusFilter = "All" | "Pending" | "In Progress" | "Resolved";

export interface FiltersState {
  tableDepartment: string;
  sentiment: SentimentFilter;
  rating: RatingFilter;
  status: StatusFilter;
  globalSearch: string;
  dateFrom: string;
  dateTo: string;
  doctorSearch: string;
  doctorDepartment: string;

  setTableDepartment: (department: string) => void;
  setSentiment: (sentiment: SentimentFilter) => void;
  setRating: (rating: RatingFilter) => void;
  setStatus: (status: StatusFilter) => void;
  setGlobalSearch: (search: string) => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setDoctorSearch: (search: string) => void;
  setDoctorDepartment: (department: string) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  tableDepartment: "All",
  sentiment: "All" as SentimentFilter,
  rating: "All" as RatingFilter,
  status: "All" as StatusFilter,
  globalSearch: "",
  dateFrom: "",
  dateTo: "",
  doctorSearch: "",
  doctorDepartment: "All",
};

export const createFiltersSlice = (
  set: (fn: (state: FiltersState) => Partial<FiltersState>) => void,
): FiltersState => ({
  ...defaultFilters,

  setTableDepartment: (tableDepartment) => set(() => ({ tableDepartment })),
  setSentiment: (sentiment) => set(() => ({ sentiment })),
  setRating: (rating) => set(() => ({ rating })),
  setStatus: (status) => set(() => ({ status })),
  setGlobalSearch: (globalSearch) => set(() => ({ globalSearch })),
  setDateFrom: (dateFrom) => set(() => ({ dateFrom })),
  setDateTo: (dateTo) => set(() => ({ dateTo })),
  setDoctorSearch: (doctorSearch) => set(() => ({ doctorSearch })),
  setDoctorDepartment: (doctorDepartment) => set(() => ({ doctorDepartment })),
  resetFilters: () => set(() => ({ ...defaultFilters })),
});
