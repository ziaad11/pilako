import OpenAI from "openai";

export async function POST(req) {
  try {
    const { idea } = await req.json();

    if (!idea || idea.trim().length < 2) {
      return Response.json(
        { result: "Please enter a clear video idea first." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "You are a world-class short-form content strategist for TikTok, Instagram Reels, YouTube Shorts, and paid ads. Your job is to create high-retention viral hooks and scripts.",
        },
        {
          role: "user",
          content: `
Create high-performing short-form content for this idea:

"${idea}"

Return the answer in this exact format:

🔥 VIRAL SCORE: /100

🎯 BEST ANGLE:
One clear angle that will make people stop scrolling.

🧲 5 VIRAL HOOKS:
1.
2.
3.
4.
5.

🎬 30-SECOND SCRIPT:
Hook:
Main points:
Ending CTA:

🚀 IMPROVEMENTS:
- 
- 
- 

Make it punchy, practical, and optimized for retention.
          `,
        },
      ],
    });

    return Response.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    return Response.json(
      { result: "Server error: " + error.message },
      { status: 500 }
    );
  }
}