export interface UIState {
  sidebarOpen: boolean;
  mobileDrawerOpen: boolean;
  notificationPanelOpen: boolean;
  activeModal: string | null;

  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  toggleMobileDrawer: () => void;
  setNotificationPanelOpen: (open: boolean) => void;
  toggleNotificationPanel: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const createUISlice = (
  set: (fn: (state: UIState) => Partial<UIState>) => void,
): UIState => ({
  sidebarOpen: true,
  mobileDrawerOpen: false,
  notificationPanelOpen: false,
  activeModal: null,

  setSidebarOpen: (open) => set(() => ({ sidebarOpen: open })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setMobileDrawerOpen: (open) => set(() => ({ mobileDrawerOpen: open })),
  toggleMobileDrawer: () => set((state) => ({ mobileDrawerOpen: !state.mobileDrawerOpen })),
  setNotificationPanelOpen: (open) => set(() => ({ notificationPanelOpen: open })),
  toggleNotificationPanel: () =>
    set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
  openModal: (modalId) => set(() => ({ activeModal: modalId })),
  closeModal: () => set(() => ({ activeModal: null })),
});