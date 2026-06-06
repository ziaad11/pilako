import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const { company, niche, location, type } = await req.json();

    if (!company || !niche || !location || !type) {
      return NextResponse.json(
        { error: "Missing company, niche, location, or type" },
        { status: 400 }
      );
    }

    const prompt = `
You are Pilako, an AI sales assistant.

Write a professional ${type} for this lead:

Company: ${company}
Niche: ${niche}
Location: ${location}

Rules:
- Keep it short and natural.
- Make it personalized.
- Avoid hype.
- Use clear business language.
- Include a soft CTA.
- If it is a cold email, include a subject line.
- If it is a LinkedIn message, keep it under 600 characters.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "OpenAI request failed" },
        { status: 500 }
      );
    }

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "No message generated.";

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
