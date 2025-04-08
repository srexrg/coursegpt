export type ActivityType = 'discussion' | 'exercise' | 'quiz' | 'project'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  content?: string
  duration?: number // in minutes
  points?: number
}

export interface Lesson {
  id: string
  title: string
  description: string
  learningOutcomes: string[]
  activities: Activity[]
  duration: number // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites?: string[]
  resources?: {
    title: string
    url: string
    type: 'video' | 'article' | 'document' | 'link'
  }[]
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  order: number
} 