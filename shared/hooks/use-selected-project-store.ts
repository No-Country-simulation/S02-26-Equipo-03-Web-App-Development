import { create } from "zustand";

type SelectedProjectState = {
  selectedProjectId: string | null;
  setSelectedProjectId(_projectId: string | null): void;
};

export const useSelectedProjectStore = create<SelectedProjectState>((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
}));
