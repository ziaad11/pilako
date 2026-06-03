import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      niche,
      location,
      company,
    } = body;

    const prompt = `
You are an expert B2B sales copywriter.

Create:

1. Cold outreach email
2. Follow-up email #1
3. Follow-up email #2

Business niche: ${niche}
Location: ${location}
Target company: ${company}

Return only valid JSON:

{
  "cold": "...",
  "follow1": "...",
  "follow2": "..."
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const result = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate outreach",
      },
      {
        status: 500,
      }
    );
  }
}