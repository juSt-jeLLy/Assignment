export type SentimentFilter = "All" | "Positive" | "Neutral" | "Negative";
export type RatingFilter = "All" | "1" | "2" | "3" | "4" | "5";
export type StatusFilter = "All" | "Pending" | "In Progress" | "Resolved";

export interface FiltersState {
  department: string;
  sentiment: SentimentFilter;
  rating: RatingFilter;
  status: StatusFilter;
  globalSearch: string;
  dateFrom: string;
  dateTo: string;

  setDepartment: (department: string) => void;
  setSentiment: (sentiment: SentimentFilter) => void;
  setRating: (rating: RatingFilter) => void;
  setStatus: (status: StatusFilter) => void;
  setGlobalSearch: (search: string) => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  department: "All",
  sentiment: "All" as SentimentFilter,
  rating: "All" as RatingFilter,
  status: "All" as StatusFilter,
  globalSearch: "",
  dateFrom: "",
  dateTo: "",
};

export const createFiltersSlice = (
  set: (fn: (state: FiltersState) => Partial<FiltersState>) => void,
): FiltersState => ({
  ...defaultFilters,

  setDepartment: (department) => set(() => ({ department })),
  setSentiment: (sentiment) => set(() => ({ sentiment })),
  setRating: (rating) => set(() => ({ rating })),
  setStatus: (status) => set(() => ({ status })),
  setGlobalSearch: (globalSearch) => set(() => ({ globalSearch })),
  setDateFrom: (dateFrom) => set(() => ({ dateFrom })),
  setDateTo: (dateTo) => set(() => ({ dateTo })),
  resetFilters: () => set(() => ({ ...defaultFilters })),
});