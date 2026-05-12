import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { createUISlice, type UIState } from "./slices/uiSlice";
import { createFiltersSlice, type FiltersState } from "./slices/filtersSlice";
import { createUserPreferencesSlice, type UserPreferencesState } from "./slices/userPreferencesSlice";

export type AppStore = UIState & FiltersState & UserPreferencesState;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...createUISlice(set as (fn: (state: UIState) => Partial<UIState>) => void),
        ...createFiltersSlice(set as (fn: (state: FiltersState) => Partial<FiltersState>) => void),
        ...createUserPreferencesSlice(
          set as (fn: (state: UserPreferencesState) => Partial<UserPreferencesState>) => void,
        ),
      }),
      {
        name: "hospital-feedback-store",
        partialize: (state) => ({
          displayName: state.displayName,
          email: state.email,
          department: state.department,
          notifyNewComplaints: state.notifyNewComplaints,
          notifyLowRatings: state.notifyLowRatings,
          notifyWeeklyDigest: state.notifyWeeklyDigest,
          notifyMilestones: state.notifyMilestones,
          defaultChartType: state.defaultChartType,
          tableDensity: state.tableDensity,
          itemsPerPage: state.itemsPerPage,
          sidebarOpen: state.sidebarOpen,
        }),
      },
    ),
    { name: "HospitalFeedbackStore" },
  ),
);

// ── UI slice selectors ────────────────────────────────────────────────────────
export const useSidebarOpen = () => useAppStore((s) => s.sidebarOpen);
export const useMobileDrawerOpen = () => useAppStore((s) => s.mobileDrawerOpen);
export const useNotificationPanelOpen = () => useAppStore((s) => s.notificationPanelOpen);
export const useActiveModal = () => useAppStore((s) => s.activeModal);

export const useSetSidebarOpen = () => useAppStore((s) => s.setSidebarOpen);
export const useToggleSidebar = () => useAppStore((s) => s.toggleSidebar);
export const useSetMobileDrawerOpen = () => useAppStore((s) => s.setMobileDrawerOpen);
export const useToggleMobileDrawer = () => useAppStore((s) => s.toggleMobileDrawer);
export const useSetNotificationPanelOpen = () => useAppStore((s) => s.setNotificationPanelOpen);
export const useToggleNotificationPanel = () => useAppStore((s) => s.toggleNotificationPanel);
export const useOpenModal = () => useAppStore((s) => s.openModal);
export const useCloseModal = () => useAppStore((s) => s.closeModal);

// ── Filters slice selectors ───────────────────────────────────────────────────
export const useDepartmentFilter = () => useAppStore((s) => s.department);
export const useSentimentFilter = () => useAppStore((s) => s.sentiment);
export const useRatingFilter = () => useAppStore((s) => s.rating);
export const useStatusFilter = () => useAppStore((s) => s.status);
export const useGlobalSearch = () => useAppStore((s) => s.globalSearch);
export const useDateFrom = () => useAppStore((s) => s.dateFrom);
export const useDateTo = () => useAppStore((s) => s.dateTo);

export const useSetDepartment = () => useAppStore((s) => s.setDepartment);
export const useSetSentiment = () => useAppStore((s) => s.setSentiment);
export const useSetRating = () => useAppStore((s) => s.setRating);
export const useSetStatus = () => useAppStore((s) => s.setStatus);
export const useSetGlobalSearch = () => useAppStore((s) => s.setGlobalSearch);
export const useSetDateFrom = () => useAppStore((s) => s.setDateFrom);
export const useSetDateTo = () => useAppStore((s) => s.setDateTo);
export const useResetFilters = () => useAppStore((s) => s.resetFilters);

// ── User preferences selectors ────────────────────────────────────────────────
export const useDisplayName = () => useAppStore((s) => s.displayName);
export const useEmail = () => useAppStore((s) => s.email);
export const useRole = () => useAppStore((s) => s.role);

export const useNotifyNewComplaints = () => useAppStore((s) => s.notifyNewComplaints);
export const useNotifyLowRatings = () => useAppStore((s) => s.notifyLowRatings);
export const useNotifyWeeklyDigest = () => useAppStore((s) => s.notifyWeeklyDigest);
export const useNotifyMilestones = () => useAppStore((s) => s.notifyMilestones);

export const useDefaultChartType = () => useAppStore((s) => s.defaultChartType);
export const useTableDensity = () => useAppStore((s) => s.tableDensity);
export const useItemsPerPage = () => useAppStore((s) => s.itemsPerPage);

export const useSetDisplayName = () => useAppStore((s) => s.setDisplayName);
export const useSetEmail = () => useAppStore((s) => s.setEmail);
export const useSetNotifyNewComplaints = () => useAppStore((s) => s.setNotifyNewComplaints);
export const useSetNotifyLowRatings = () => useAppStore((s) => s.setNotifyLowRatings);
export const useSetNotifyWeeklyDigest = () => useAppStore((s) => s.setNotifyWeeklyDigest);
export const useSetNotifyMilestones = () => useAppStore((s) => s.setNotifyMilestones);
export const useSetDefaultChartType = () => useAppStore((s) => s.setDefaultChartType);
export const useSetTableDensity = () => useAppStore((s) => s.setTableDensity);
export const useSetItemsPerPage = () => useAppStore((s) => s.setItemsPerPage);