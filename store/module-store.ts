import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Module } from "@/types/lesson"

interface ModuleMetadata {
  prerequisites: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedDuration: number
  suggestedNext: string[]
}

interface ModuleState {
  modules: (Module & { metadata?: ModuleMetadata })[]
  suggestedSequence: string[] 
  isLoading: boolean
  error: string | null
  addModule: (module: Module) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateSequence: (sequence: string[]) => void
  updateMetadata: (moduleId: string, metadata: ModuleMetadata) => void,
  clearStore: () => void
  
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set) => ({
      modules: [],
      suggestedSequence: [],
      isLoading: false,
      error: null,
      addModule: (module) => set((state) => ({ modules: [...state.modules, module] })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      updateSequence: (sequence) =>
        set({ suggestedSequence: sequence }),
      updateMetadata: (moduleId, metadata) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId ? { ...m, metadata } : m
          ),
        })),
      clearStore: () => set({ modules: [], suggestedSequence: [] }),
    }),
    
    {
      name: "module-storage",
    }
  )
) 