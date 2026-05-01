import OpenAI from "openai";

export async function POST(req) {
  try {
    const { idea } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Give 3 viral hooks for: ${idea}`,
        },
      ],
    });

    return Response.json({
      result: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("ERROR:", error);

    return Response.json(
      { result: "Server error: " + error.message },
      { status: 500 }
    );
  }
}