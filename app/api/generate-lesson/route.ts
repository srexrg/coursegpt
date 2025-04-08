import { NextResponse } from "next/server"
import OpenAI from "openai"
import { z } from "zod"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const lessonSchema = z.object({
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
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.number(), // in minutes
})

export async function POST(request: Request) {
  try {
    const { topic, context } = await request.json()

    if (!topic || !context) {
      return NextResponse.json(
        { error: "Topic and context are required" },
        { status: 400 }
      )
    }

    const prompt = `Create a structured lesson plan for the topic: "${topic}" with the following context: "${context}".
    The lesson should include:
    1. A compelling title
    2. A detailed description
    3. Clear learning outcomes
    4. Key concepts and terminology
    5. Engaging learning activities
    6. Practical examples
    7. Appropriate difficulty level (beginner/intermediate/advanced)
    8. Estimated duration in minutes

    Format the response as a JSON object matching this structure:
    {
      "title": "string",
      "description": "string",
      "learningOutcomes": ["string"],
      "keyConcepts": ["string"],
      "activities": [
        {
          "title": "string",
          "description": "string",
          "type": "discussion" | "exercise" | "quiz" | "project"
        }
      ],
      "examples": [
        {
          "title": "string",
          "content": "string"
        }
      ],
      "difficulty": "beginner" | "intermediate" | "advanced",
      "duration": number
    }`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert educational content creator. Create detailed, engaging, and pedagogically sound lesson plans.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("Failed to generate lesson content")
    }

    const parsedContent = JSON.parse(content)
    const validatedContent = lessonSchema.parse(parsedContent)

    return NextResponse.json(validatedContent)
  } catch (error) {
    console.error("Error generating lesson:", error)
    return NextResponse.json(
      { error: "Failed to generate lesson" },
      { status: 500 }
    )
  }
} 