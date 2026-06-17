import { create } from "zustand";

interface UIState {
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  searchModalOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSearchModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchModalOpen: false,
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  toggleCartDrawer: () =>
    set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleSearchModal: () =>
    set((state) => ({ searchModalOpen: !state.searchModalOpen })),
}));
