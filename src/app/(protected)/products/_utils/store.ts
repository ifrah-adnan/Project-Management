// import { create } from "zustand";

// type TState = {
//   view: "list" | "grid";
//   showFilters: boolean;
//   filters: Record<string, string>;
// };

// const defaultState: TState = {
//   view: "list",
//   showFilters: false,
//   filters: {},
// };

// type TActions = {
//   toggleView: () => void;
//   toggleFilters: () => void;
//   resetFilters: () => void;
// };

// export const useStore = create<TState & TActions>((set) => ({
//   ...defaultState,
//   toggleView: () =>
//     set((state) => ({ view: state.view === "list" ? "grid" : "list" })),
//   toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
//   resetFilters: () => set({ filters: {} }),
// }));

import { create } from "zustand";

interface ViewState {
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
}

export const useStore = create<ViewState>((set) => ({
  view: "list",
  setView: (view) => set({ view }),
}));
