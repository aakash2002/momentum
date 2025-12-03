import { NextResponse } from "next/server";
import { taskCardArraySchema } from "@/lib/schemas/taskSchema";
import systemPrompt from "@/lib/ai/systemPrompt";
import type { TaskCardProps, Subtask } from "@/types";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
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

  try {
    // Map "assistant" role to "model" for Gemini API compatibility
    const geminiMessages = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: msg.parts,
    }));

    console.log("Formatted messages for Gemini:", JSON.stringify(geminiMessages, null, 2));

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        ...geminiMessages
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 10000
      }
    })
  });


  if (!response.ok) {
    const errorData = await response.text();
    console.error("Gemini API error:", response.status, errorData);
    return NextResponse.json({ 
      error: `Gemini API error: ${response.status}`,
      details: errorData,
      type: "clarification",
      content: "I'm sorry, there was an error processing your request. Please try again."
    }, { status: response.status });
  }

  const data = await response.json();
  console.log("Full Gemini API response:", JSON.stringify(data, null, 2));

  // Check for errors in the response
  if (data.error) {
    console.error("Gemini API returned error:", data.error);
    return NextResponse.json({ 
      error: data.error.message || "Gemini API error",
      details: data.error,
      type: "clarification",
      content: "I'm sorry, there was an error processing your request. Please try again."
    }, { status: 400 });
  }

  // Check if candidates exist
  if (!data.candidates || data.candidates.length === 0) {
    console.error("No candidates in Gemini response:", data);
    return NextResponse.json({ 
      error: "No response from Gemini",
      details: data,
      type: "clarification",
      content: "I'm sorry, I didn't receive a response. Please try again."
    }, { status: 400 });
  }

  // Check if content exists
  const candidate = data.candidates[0];
  if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
    console.error("No content in Gemini candidate:", candidate);
    return NextResponse.json({ 
      error: "Empty response from Gemini",
      details: candidate,
      type: "clarification",
      content: "I'm sorry, I received an empty response. Please try again."
    }, { status: 400 });
  }

  const responseText = candidate.content.parts[0]?.text ?? "";

  console.log("Gemini Response Text:", responseText);
  console.log("Response Text Length:", responseText.length);

  if (!responseText || responseText.trim().length === 0) {
    console.error("Empty response text from Gemini");
    return NextResponse.json({ 
      error: "Empty response from Gemini",
      type: "clarification",
      content: "I'm sorry, I didn't receive a proper response. Could you please rephrase your request?"
    }, { status: 200 });
  }

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
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ 
      error: "Failed to call Gemini API",
      details: error instanceof Error ? error.message : String(error),
      type: "clarification",
      content: "I'm sorry, there was an error processing your request. Please try again."
    }, { status: 500 });
  }
}