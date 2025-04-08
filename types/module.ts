import { Lesson } from "./lesson"

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface ModuleMetadata {
  prerequisites: string[]
  difficulty: DifficultyLevel
  estimatedDuration: number
  suggestedNext?: string[]
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  order: number
  metadata?: ModuleMetadata
}

export interface ModuleRelationship {
  moduleId: string
  prerequisites: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedDuration: number
  suggestedNext: string[]
} 