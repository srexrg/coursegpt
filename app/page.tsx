"use client"

import { useState } from "react"
import { LessonGenerator } from "@/components/lesson-generator"
import { ContentEditor } from "@/components/content-editor"
import { ModuleOrganizer } from "@/components/module-organizer"
// import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Lesson } from "@/types/lesson"

export default function Home() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)

  const handleLessonGenerated = (lesson: Lesson) => {
    setCurrentLesson(lesson)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="mb-8 text-4xl font-bold">CourseGPT</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Create engaging and structured lessons with AI assistance
        </p>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList>
            <TabsTrigger value="generate">Generate Lesson</TabsTrigger>
            <TabsTrigger value="edit" disabled={!currentLesson}>
              Edit Content
            </TabsTrigger>
            <TabsTrigger value="organize" disabled={!currentLesson}>
              Organize Modules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <LessonGenerator onLessonGenerated={handleLessonGenerated} />
          </TabsContent>

          <TabsContent value="edit" className="space-y-6">
            {currentLesson && (
              <ContentEditor
                lesson={currentLesson}
                onUpdate={setCurrentLesson}
              />
            )}
          </TabsContent>

          <TabsContent value="organize" className="space-y-6">
            {currentLesson && <ModuleOrganizer />}
          </TabsContent>
        </Tabs>
      </div>
      {/* <Toaster /> */}
    </main>
  )
}
