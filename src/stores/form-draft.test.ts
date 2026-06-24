import { describe, it, expect, beforeEach } from "vitest"
import { useFormDraftStore } from "./form-draft"

beforeEach(() => {
  // Reset store between tests
  const { clearDraft } = useFormDraftStore.getState()
  clearDraft()
  localStorage.clear()
})

describe("useFormDraftStore", () => {
  it("initializes with empty fields", () => {
    const state = useFormDraftStore.getState()
    expect(state.title).toBe("")
    expect(state.category).toBe("")
    expect(state.description).toBe("")
  })

  it("setDraft updates specified fields", () => {
    const { setDraft } = useFormDraftStore.getState()
    setDraft({ title: "Hello", category: "bug" })

    const state = useFormDraftStore.getState()
    expect(state.title).toBe("Hello")
    expect(state.category).toBe("bug")
    expect(state.description).toBe("")
  })

  it("setDraft merges partial updates", () => {
    const { setDraft } = useFormDraftStore.getState()
    setDraft({ title: "T1", category: "C1" })
    setDraft({ description: "D1" })

    const state = useFormDraftStore.getState()
    expect(state.title).toBe("T1")
    expect(state.category).toBe("C1")
    expect(state.description).toBe("D1")
  })

  it("clearDraft resets all fields", () => {
    const { setDraft, clearDraft } = useFormDraftStore.getState()
    setDraft({ title: "T", category: "C", description: "D" })
    clearDraft()

    const state = useFormDraftStore.getState()
    expect(state.title).toBe("")
    expect(state.category).toBe("")
    expect(state.description).toBe("")
  })
})
