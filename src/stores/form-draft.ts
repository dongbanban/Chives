import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface FormDraftState {
  title: string
  category: string
  description: string
  setDraft: (draft: Partial<Pick<FormDraftState, "title" | "category" | "description">>) => void
  clearDraft: () => void
}

const initialState = {
  title: "",
  category: "",
  description: "",
}

export const useFormDraftStore = create<FormDraftState>()(
  persist(
    (set) => ({
      ...initialState,
      setDraft: (draft) => set((s) => ({ ...s, ...draft })),
      clearDraft: () => set({ ...initialState }),
    }),
    { name: "chives-form-draft" }
  )
)
