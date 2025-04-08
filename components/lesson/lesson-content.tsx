import { useLessonStore } from "@/store/lesson-store"
import { ActivityType } from "@/types/lesson"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, MessageSquare, FileText, Code2 } from "lucide-react"

const activityIcons: Record<ActivityType, React.ReactNode> = {
  discussion: <MessageSquare className="h-5 w-5" />,
  exercise: <FileText className="h-5 w-5" />,
  quiz: <BookOpen className="h-5 w-5" />,
  project: <Code2 className="h-5 w-5" />,
}

export function LessonContent() {
  const { currentLesson, isLoading, error } = useLessonStore()
  console.log("Current lesson:", currentLesson)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!currentLesson) {
    return <div>No lesson selected</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{currentLesson.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {currentLesson.description}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            {currentLesson.learningOutcomes.map((outcome, index) => (
              <li key={index}>{outcome}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Tabs defaultValue="activities" className="w-full">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="activities" className="space-y-4">
          {currentLesson.activities.map((activity, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {activityIcons[activity.type]}
                  <CardTitle>{activity.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{activity.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
} 