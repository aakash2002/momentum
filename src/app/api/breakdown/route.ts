import { NextResponse } from "next/server";
import { taskCardArraySchema } from "@/lib/schemas/taskSchema";
import systemPrompt from "@/lib/ai/systemPrompt";
import type { TaskCardProps, Subtask } from "@/types";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = process.env.API_KEY;

type GeminiContent = { role: "user" | "model"; parts: { text: string }[] };

export function normalizeTasks(rawTasks: unknown[]): TaskCardProps[] {
  return (rawTasks as TaskCardProps[]).map((task): TaskCardProps => ({
    ...task,
    priority: task.priority
      .trim()
      .toLowerCase()
      .replace(/^./, (c) => c.toUpperCase()) as TaskCardProps["priority"],
    subtasks: task.subtasks.map((subtask): Subtask => ({
      ...subtask,
      status: subtask.status
        .trim()
        .toLowerCase()
        .replace(" ", "_") as Subtask["status"],
    })),
  }));
}

export async function POST(req: Request) {
  if (!API_KEY) {
    console.error("Missing GEMINI_API_KEY in .env.local");
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  const { messages } = await req.json(); // contains full chat history so far from client

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        ...messages
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024
      }
    })
  });


  const data = await response.json();
  const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  console.log("Gemini Response:", responseText)

  if (responseText.includes("json_start") && responseText.includes("json_end")) {
    const introMessage = responseText.split("json_start")[0];
    const jsonString = responseText.split("json_start")[1]?.split("json_end")[0]?.trim();
      try {
        // console.log("Intro message", introMessage);
        // console.log("JSON string", jsonString);
        const cleaned = jsonString
    .replace(/```json/, "")
    .replace(/```/, "")
    .trim();

  // console.log("Cleaned JSON to parse:", cleaned);

      let parsedJson;
      try {
        parsedJson = JSON.parse(cleaned);
      } catch (err) {
        console.error("JSON.parse failed:", err);
        return NextResponse.json({ error: "Parse error: Failed to parse JSON from response" }, { status: 400 });
      }
      // const normalized = normalizeTasks(parsedJson.tasks);
      // const parsedTasks = taskCardArraySchema.parse(normalized);
      return NextResponse.json({
        type: "plan",
        intro: introMessage.trim(),
        tasks: parsedJson.tasks,
      });
    } catch (e) {
      return NextResponse.json({ error: "Other error: Failed to parse JSON from response" }, { status: 400 });
    }
  } else {
    console.log("Asking clarification!");
    return NextResponse.json({
      type: "clarification",
      content: responseText.trim(),
    });
  }
}