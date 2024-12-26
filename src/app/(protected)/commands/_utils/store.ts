import { create } from "zustand";

interface ViewState {
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
}

export const useStore = create<ViewState>((set) => ({
  view: "list",
  setView: (view) => set({ view }),
}));
