import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Lead = {
  id: number;
  company: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  score: string;
};

export async function POST(req: Request) {
  try {
    const { niche, location, leads } = await req.json();

    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json(
        { error: "No leads provided" },
        { status: 400 }
      );
    }

    const safeLeads: Lead[] = leads.slice(0, 25);

    const prompt = `
You are an expert B2B cold email copywriter.

Create one personalized outreach email for each lead.

Business niche: ${niche}
Location: ${location}

Leads:
${safeLeads
  .map(
    (lead, index) =>
      `${index + 1}. Company: ${lead.company}, Website: ${lead.website}, Email: ${lead.email}, Phone: ${lead.phone}, Location: ${lead.location}`
  )
  .join("\n")}

Rules:
- Keep each email short and professional.
- No fake claims.
- Do not mention things you cannot know.
- Each email must have a subject and message.
- Return only valid JSON.
- The JSON must be an object with an "emails" array.
- Each item must include: leadId, company, email, subject, message.

Format:
{
  "emails": [
    {
      "leadId": 123,
      "company": "Company Name",
      "email": "email@example.com",
      "subject": "Subject here",
      "message": "Message here"
    }
  ]
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

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return NextResponse.json({
      emails: result.emails || [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate bulk outreach" },
      { status: 500 }
    );
  }
}