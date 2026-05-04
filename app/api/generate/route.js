import OpenAI from "openai";

export async function POST(req) {
  try {
    const { idea } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: `
You are a viral short-form video strategist.

Video idea:
${idea}

Return ONLY valid JSON with this exact structure:
{
  "hooks": ["hook 1", "hook 2", "hook 3", "hook 4", "hook 5"],
  "script": "30-second ready-to-record script",
  "score": 85,
  "score_reason": "short explanation why",
  "improvements": ["tip 1", "tip 2", "tip 3"]
}

Make it optimized for TikTok, Instagram Reels, and YouTube Shorts.
          `,
        },
      ],
    });

    const content = response.choices[0].message.content;
    return Response.json(JSON.parse(content));
  } catch (error) {
    return Response.json(
      {
        error: "AI generation failed. Check your API key or credits.",
      },
      { status: 500 }
    );
  }
}