"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { generateLesson } from "@/lib/openai"
import { useLessonStore } from "@/store/lesson-store"
import { ActivityType, Lesson } from "@/types/lesson"
import { LessonContent } from "@/components/lesson/lesson-content"

interface ContentEditorProps {
  lesson: Lesson
  onUpdate: (updatedLesson: Lesson) => void
}

export function ContentEditor({ lesson, onUpdate }: ContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLesson, setEditedLesson] = useState<Lesson>(lesson)
  const { updateLesson } = useLessonStore()

  // Update editedLesson when lesson prop changes
  useEffect(() => {
    setEditedLesson(lesson)
  }, [lesson])

  const handleRegenerateSection = async (section: keyof Lesson) => {
    try {
      console.log("Regenerating", `${section} section for lesson: ${lesson.title}`)
      const newContent = await generateLesson(lesson.title, `Regenerate the ${section} section for this lesson: ${lesson.title}`)
      
      // Update the editedLesson with the new content
      setEditedLesson(prev => ({
        ...prev,
        [section]: newContent[section],
      }))
      
      // Also update the lesson store to persist changes
      updateLesson({ [section]: newContent[section] })
      
      console.log("Success", `${section} regenerated successfully`)
    } catch (error) {
      console.error("Error", `Failed to regenerate ${section}:`, error)
    }
  }

  const handleSave = () => {
    onUpdate(editedLesson)
    setIsEditing(false)
    console.log("Success", "Changes saved successfully")
  }

  const handleAddActivity = () => {
    setEditedLesson(prev => ({
      ...prev,
      activities: [
        ...prev.activities,
        {
          id: crypto.randomUUID(),
          title: "",
          description: "",
          type: "discussion",
        },
      ],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Editor</h2>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setEditedLesson(lesson)
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Content</Button>
          )}
        </div>
      </div>

      {!isEditing && <LessonContent />}

      {isEditing && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Title</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRegenerateSection("title")}
              >
                Regenerate
              </Button>
            </div>
            <input
              value={editedLesson.title}
              onChange={(e) =>
                setEditedLesson({ ...editedLesson, title: e.target.value })
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Description</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRegenerateSection("description")}
              >
                Regenerate
              </Button>
            </div>
            <textarea
              value={editedLesson.description}
              onChange={(e) =>
                setEditedLesson({ ...editedLesson, description: e.target.value })
              }
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Learning Outcomes</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRegenerateSection("learningOutcomes")}
              >
                Regenerate
              </Button>
            </div>
            <div className="space-y-2">
              {editedLesson.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={outcome}
                    onChange={(e) => {
                      const newOutcomes = [...editedLesson.learningOutcomes]
                      newOutcomes[index] = e.target.value
                      setEditedLesson({
                        ...editedLesson,
                        learningOutcomes: newOutcomes,
                      })
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOutcomes = editedLesson.learningOutcomes.filter(
                        (_, i) => i !== index
                      )
                      setEditedLesson({
                        ...editedLesson,
                        learningOutcomes: newOutcomes,
                      })
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedLesson({
                    ...editedLesson,
                    learningOutcomes: [...editedLesson.learningOutcomes, ""],
                  })
                }}
              >
                Add Outcome
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Activities</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRegenerateSection("activities")}
              >
                Regenerate
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {editedLesson.activities.map((activity, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <input
                      value={activity.title}
                      onChange={(e) => {
                        const newActivities = [...editedLesson.activities]
                        newActivities[index] = {
                          ...activity,
                          title: e.target.value,
                        }
                        setEditedLesson({
                          ...editedLesson,
                          activities: newActivities,
                        })
                      }}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <textarea
                      value={activity.description}
                      onChange={(e) => {
                        const newActivities = [...editedLesson.activities]
                        newActivities[index] = {
                          ...activity,
                          description: e.target.value,
                        }
                        setEditedLesson({
                          ...editedLesson,
                          activities: newActivities,
                        })
                      }}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <select
                      value={activity.type}
                      onChange={(e) => {
                        const newActivities = [...editedLesson.activities]
                        newActivities[index] = {
                          ...activity,
                          type: e.target.value as ActivityType,
                        }
                        setEditedLesson({
                          ...editedLesson,
                          activities: newActivities,
                        })
                      }}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="discussion">Discussion</option>
                      <option value="exercise">Exercise</option>
                      <option value="quiz">Quiz</option>
                      <option value="project">Project</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newActivities = editedLesson.activities.filter(
                          (_, i) => i !== index
                        )
                        setEditedLesson({
                          ...editedLesson,
                          activities: newActivities,
                        })
                      }}
                    >
                      Remove Activity
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddActivity}
              >
                Add Activity
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}