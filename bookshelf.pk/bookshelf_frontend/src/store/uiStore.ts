import { create } from "zustand";

interface UIState {
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  searchModalOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  setMobileMenu: (open: boolean) => void;
  setSearchModal: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchModalOpen: false,
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  toggleCartDrawer: () =>
    set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  setMobileMenu: (open) => set({ mobileMenuOpen: open }),
  setSearchModal: (open) => set({ searchModalOpen: open }),
}));
