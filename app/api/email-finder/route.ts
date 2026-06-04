import { NextResponse } from "next/server";

type Lead = {
  id: number;
  company: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  score: string;
};

function normalizeUrl(website: string) {
  if (!website || website === "Not found" || website === "Not provided") {
    return "";
  }

  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }

  return `https://${website}`;
}

function extractEmails(text: string) {
  const matches =
    text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];

  return [...new Set(matches)]
    .filter((email) => !email.includes("example.com"))
    .slice(0, 3);
}

async function fetchPage(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 PilakoBot/1.0",
      },
    });

    if (!res.ok) return "";

    return await res.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: Request) {
  try {
    const { leads } = await req.json();

    if (!Array.isArray(leads)) {
      return NextResponse.json(
        { error: "Leads must be an array" },
        { status: 400 }
      );
    }

    const enrichedLeads: Lead[] = await Promise.all(
      leads.map(async (lead: Lead) => {
        const baseUrl = normalizeUrl(lead.website);

        if (!baseUrl) {
          return lead;
        }

        const pagesToCheck = [
          baseUrl,
          `${baseUrl.replace(/\/$/, "")}/contact`,
          `${baseUrl.replace(/\/$/, "")}/about`,
        ];

        let foundEmails: string[] = [];

        for (const page of pagesToCheck) {
          const html = await fetchPage(page);
          const emails = extractEmails(html);

          if (emails.length > 0) {
            foundEmails = emails;
            break;
          }
        }

        return {
          ...lead,
          email:
            foundEmails.length > 0
              ? foundEmails.join(", ")
              : lead.email || "Not found",
        };
      })
    );

    return NextResponse.json({ leads: enrichedLeads });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to find emails" },
      { status: 500 }
    );
  }
}