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
  suggestedSequence: string[] // Module IDs in suggested order
  isLoading: boolean
  error: string | null
  setModules: (modules: Module[]) => void
  addModule: (module: Module) => void
  updateModule: (moduleId: string, updates: Partial<Module & { metadata?: ModuleMetadata }>) => void
  removeModule: (id: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addLessonToModule: (moduleId: string, lesson: any) => void
  removeLessonFromModule: (moduleId: string, lessonId: string) => void
  reorderLessons: (moduleId: string, oldIndex: number, newIndex: number) => void
  moveLessonBetweenModules: (sourceModuleId: string, destModuleId: string, lessonId: string, newIndex: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateSequence: (sequence: string[]) => void
  updateMetadata: (moduleId: string, metadata: ModuleMetadata) => void,
  clearStore: () => void
  
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      modules: [],
      suggestedSequence: [],
      isLoading: false,
      error: null,
      setModules: (modules) => set({ modules }),
      addModule: (module) => set((state) => ({ modules: [...state.modules, module] })),
      updateModule: (moduleId, updates) => 
        set((state) => ({
          modules: state.modules.map((m) => 
            m.id === moduleId ? { ...m, ...updates } : m
          ),
        })),
      removeModule: (id) => 
        set((state) => ({
          modules: state.modules.filter((module) => module.id !== id),
        })),
      addLessonToModule: (moduleId, lesson) => 
        set((state) => ({
          modules: state.modules.map((module) => 
            module.id === moduleId 
              ? { ...module, lessons: [...module.lessons, lesson] } 
              : module
          ),
        })),
      removeLessonFromModule: (moduleId, lessonId) => 
        set((state) => ({
          modules: state.modules.map((module) => 
            module.id === moduleId 
              ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) } 
              : module
          ),
        })),
      reorderLessons: (moduleId, oldIndex, newIndex) => {
        const state = get();
        const targetModule = state.modules.find(m => m.id === moduleId);
        if (!targetModule) return;

        const newLessons = [...targetModule.lessons];
        const [lesson] = newLessons.splice(oldIndex, 1);
        newLessons.splice(newIndex, 0, lesson);

        set({
          modules: state.modules.map(m => 
            m.id === moduleId ? { ...m, lessons: newLessons } : m
          ),
        });
      },
      moveLessonBetweenModules: (sourceModuleId, destModuleId, lessonId, newIndex) => {
        const state = get();
        const sourceModule = state.modules.find(m => m.id === sourceModuleId);
        const destModule = state.modules.find(m => m.id === destModuleId);
        
        if (!sourceModule || !destModule) return state;
        
        const lesson = sourceModule.lessons.find(l => l.id === lessonId);
        if (!lesson) return state;
        
        const updatedSourceLessons = sourceModule.lessons.filter(l => l.id !== lessonId);
        const updatedDestLessons = [...destModule.lessons];
        updatedDestLessons.splice(newIndex, 0, lesson);
        
        set({
          modules: state.modules.map(m => {
            if (m.id === sourceModuleId) {
              return { ...m, lessons: updatedSourceLessons };
            }
            if (m.id === destModuleId) {
              return { ...m, lessons: updatedDestLessons };
            }
            return m;
          }),
        });
      },
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