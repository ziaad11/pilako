import OpenAI from "openai";

export async function POST(req) {
  const { idea } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Give 3 viral hooks for: ${idea}`,
      },
    ],
  });

  return Response.json({
    result: response.choices[0].message.content,
  });
}