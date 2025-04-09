"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { generateLesson } from "@/lib/openai"
import { useLessonStore } from "@/store/lesson-store"
import { Lesson } from "@/types/lesson"
import { v4 as uuidv4 } from "uuid"
import { Loader2 } from "lucide-react"

interface LessonGeneratorProps {
  onLessonGenerated: (lesson: Lesson) => void
}

export function LessonGenerator({ onLessonGenerated }: LessonGeneratorProps) {
  const [topic, setTopic] = useState("")
  const [context, setContext] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { 
    currentLesson, 
    setCurrentLesson, 
    setLoading, 
    setError 
  } = useLessonStore()

  // useEffect(() => {
  //   if (currentLesson) {

  //   }
  // }, [currentLesson])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoading(true)
    setError(null)
    setCurrentLesson(null)

    try {
      const generatedLesson = await generateLesson(topic, context)
      

      const transformedLesson: Lesson = {
        id: uuidv4(),
        title: generatedLesson.title,
        description: generatedLesson.description,
        learningOutcomes: generatedLesson.learningOutcomes,
        activities: generatedLesson.activities.map(activity => ({
          id: uuidv4(),
          type: activity.type,
          title: activity.title,
          description: activity.description
        })),
        duration: generatedLesson.duration, 
        difficulty: generatedLesson.difficulty, 
        resources: [] 
      }
      
      setCurrentLesson(transformedLesson)
      onLessonGenerated(transformedLesson)
      console.log("Success", "Lesson generated successfully!")
    } catch (error) {
      console.error("Error", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="topic"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Topic
          </label>
          <input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter the topic for your lesson"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="context"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Context
          </label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Provide additional context or requirements for the lesson"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Lesson"
          )}
        </Button>
      </form>

      {currentLesson && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
          <p className="text-muted-foreground">{currentLesson.description}</p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Learning Outcomes</h3>
            <ul className="list-disc pl-6">
              {currentLesson.learningOutcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Activities</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {currentLesson.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-lg border p-4 shadow-sm"
                >
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-secondary px-2 py-1 text-xs">
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {currentLesson.resources && currentLesson.resources.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Resources</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {currentLesson.resources.map((resource) => (
                  <div
                    key={resource.title}
                    className="rounded-lg border p-4 shadow-sm"
                  >
                    <h4 className="font-medium">{resource.title}</h4>
                    <a 
                      href={resource.url} 
                      className="text-sm text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resource
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 