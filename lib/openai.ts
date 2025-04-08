import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { type Lesson as ComponentLesson } from "@/types/lesson"

export const lessonSchema = z.object({
  title: z.string(),
  description: z.string(),
  learningOutcomes: z.array(z.string()),
  keyConcepts: z.array(z.string()),
  activities: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      type: z.enum(["discussion", "exercise", "quiz", "project"]),
    })
  ),
  examples: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  duration: z.number(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"])
})

export type Lesson = z.infer<typeof lessonSchema>

export async function generateLesson(topic: string, context: string): Promise<ComponentLesson> {
  const response = await fetch("/api/generate-lesson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic, context }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to generate lesson")
  }

  const data = await response.json()
  const apiLesson = lessonSchema.parse(data)
  
  // Transform API lesson to component lesson type
  return {
    id: uuidv4(),
    title: apiLesson.title,
    description: apiLesson.description,
    learningOutcomes: apiLesson.learningOutcomes,
    activities: apiLesson.activities.map(activity => ({
      id: uuidv4(),
      type: activity.type,
      title: activity.title,
      description: activity.description
    })),
    duration: apiLesson.duration,
    difficulty: apiLesson.difficulty,
    resources: []
  }
}