import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Lesson } from "../types/lesson"

interface LessonState {
  currentLesson: Lesson | null
  isLoading: boolean
  error: string | null
  setCurrentLesson: (lesson: Lesson | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateLesson: (lesson: Partial<Lesson>) => void
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      currentLesson: null,
      isLoading: false,
      error: null,
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      updateLesson: (lesson) =>
        set((state) => ({
          currentLesson: state.currentLesson
            ? { ...state.currentLesson, ...lesson }
            : null,
        })),
    }),
    {
      name: "lesson-storage",
    }
  )
) 