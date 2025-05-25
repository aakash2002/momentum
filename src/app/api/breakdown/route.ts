import { NextResponse } from "next/server";
import { taskCardArraySchema } from "@/lib/schemas/taskSchema";
import systemPrompt from "@/lib/ai/systemPrompt";
import type { TaskCardProps } from "@/types";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = process.env.API_KEY;

type GeminiContent = { role: "user" | "model"; parts: { text: string }[] };

export async function POST(req: Request) {
  if (!API_KEY) {
    console.error("Missing GEMINI_API_KEY in .env.local");
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  const { userInput } = await req.json();

  const messages: GeminiContent[] = [
    {
      role: "user",
      parts: [{ text: systemPrompt + "\n\n" + userInput }]
    }
  ];

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: messages,
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024
      }
    })
  });

  const json = await response.json();
  console.log("Gemini raw response:", json);

  const outputText = json.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("Gemini output text:", outputText);

  if (!outputText) {
    return NextResponse.json({ error: "No valid text from Gemini." }, { status: 500 });
  }

  try {
    const cleanText = outputText
      .replace(/^[\s\S]*?({[\s\S]*})[\s\S]*$/, '$1') // extract only the JSON object
      .replace(/```json|```/g, '') // remove markdown code blocks if present

    console.log("🧹 Cleaned Gemini JSON string:", cleanText);

    const parsed: unknown = JSON.parse(cleanText);
    const validated = taskCardArraySchema.safeParse(parsed);
    if (!validated.success) {
      console.error("Zod validation errors:", validated.error.format());
      return NextResponse.json({ error: "Invalid structure returned from Gemini." }, { status: 500 });
    }
    return NextResponse.json({ tasks: validated.data.tasks });
  } catch (err) {
    console.error("Validation error:", err);
    return NextResponse.json({ error: "Invalid structure returned from Gemini." }, { status: 500 });
  }
}
