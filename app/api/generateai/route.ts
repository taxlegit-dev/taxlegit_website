import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an expert Indian CA and compliance consultant.
Always provide COMPLETE, STEP-BY-STEP guides.
Never cut steps in between.
Always include:
- Basic Introduction
- Eligibility
- Documents required
- Step-by-step process
- Timelines
just in 100- 150 words
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1200, // 🔥 IMPORTANT
    });

    const text =
      completion.choices[0]?.message?.content || "No response generated";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
