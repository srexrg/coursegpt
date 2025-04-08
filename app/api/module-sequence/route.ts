import { NextResponse } from "next/server"
import OpenAI from "openai"
import { z } from "zod"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const moduleSequenceSchema = z.object({
  suggestedOrder: z.array(z.string()), // Module IDs in suggested order
  relationships: z.array(z.object({
    moduleId: z.string(),
    prerequisites: z.array(z.string()),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    estimatedDuration: z.number(), // in minutes
    suggestedNext: z.array(z.string()), // Module IDs that could come next
  })),
  reasoning: z.string(),
})

export async function POST(request: Request) {
  try {
    const { modules } = await request.json()

    const prompt = `Analyze these course modules and suggest an optimal learning sequence:
    ${JSON.stringify(modules, null, 2)}
    
    Consider:
    1. Prerequisites and dependencies between modules
    2. Difficulty progression
    3. Logical flow of concepts
    4. Learning path optimization
    
    Return a JSON object with this EXACT structure:
    {
      "suggestedOrder": ["moduleId1", "moduleId2", ...], // Array of module IDs in suggested order
      "relationships": [
        {
          "moduleId": "string",
          "prerequisites": ["moduleId1", "moduleId2"],
          "difficulty": "beginner" | "intermediate" | "advanced",
          "estimatedDuration": number,
          "suggestedNext": ["moduleId1", "moduleId2"]
        }
      ],
      "reasoning": "string explaining the sequence"
    }`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert curriculum designer. Analyze course modules and suggest optimal learning sequences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content
    console.log(content)
    if (!content) {
      throw new Error("Failed to generate sequence suggestions")
    }

    const parsedContent = JSON.parse(content)
    const validatedContent = moduleSequenceSchema.parse(parsedContent)

    return NextResponse.json(validatedContent)
  } catch (error) {
    console.error("Error generating sequence suggestions:", error)
    return NextResponse.json(
      { error: "Failed to generate sequence suggestions" },
      { status: 500 }
    )
  }
} 