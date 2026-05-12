export type Theme = "light" | "dark";
export type ChartType = "bar" | "line" | "area";
export type TableDensity = "comfortable" | "compact";

export interface UserPreferencesState {
  displayName: string;
  email: string;
  department: string;
  role: string;

  // Notification preferences
  notifyNewComplaints: boolean;
  notifyLowRatings: boolean;
  notifyWeeklyDigest: boolean;
  notifyMilestones: boolean;

  // Display preferences
  defaultChartType: ChartType;
  tableDensity: TableDensity;
  itemsPerPage: number;

  setDisplayName: (name: string) => void;
  setEmail: (email: string) => void;
  setDepartment: (department: string) => void;
  setNotifyNewComplaints: (value: boolean) => void;
  setNotifyLowRatings: (value: boolean) => void;
  setNotifyWeeklyDigest: (value: boolean) => void;
  setNotifyMilestones: (value: boolean) => void;
  setDefaultChartType: (type: ChartType) => void;
  setTableDensity: (density: TableDensity) => void;
  setItemsPerPage: (count: number) => void;
}

export const createUserPreferencesSlice = (
  set: (fn: (state: UserPreferencesState) => Partial<UserPreferencesState>) => void,
): UserPreferencesState => ({
  displayName: "Hospital Admin",
  email: "admin@pulsecare.io",
  department: "Operations",
  role: "Administrator",

  notifyNewComplaints: true,
  notifyLowRatings: true,
  notifyWeeklyDigest: false,
  notifyMilestones: true,

  defaultChartType: "bar",
  tableDensity: "comfortable",
  itemsPerPage: 10,

  setDisplayName: (displayName) => set(() => ({ displayName })),
  setEmail: (email) => set(() => ({ email })),
  setDepartment: (department) => set(() => ({ department })),
  setNotifyNewComplaints: (notifyNewComplaints) => set(() => ({ notifyNewComplaints })),
  setNotifyLowRatings: (notifyLowRatings) => set(() => ({ notifyLowRatings })),
  setNotifyWeeklyDigest: (notifyWeeklyDigest) => set(() => ({ notifyWeeklyDigest })),
  setNotifyMilestones: (notifyMilestones) => set(() => ({ notifyMilestones })),
  setDefaultChartType: (defaultChartType) => set(() => ({ defaultChartType })),
  setTableDensity: (tableDensity) => set(() => ({ tableDensity })),
  setItemsPerPage: (itemsPerPage) => set(() => ({ itemsPerPage })),
});