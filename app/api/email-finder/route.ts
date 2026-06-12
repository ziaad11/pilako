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

  return matches;
}

function extractMailto(html: string) {
  const matches = html.match(/mailto:([^"'? <]+)/gi) || [];

  return matches.map((item) =>
    item.replace(/mailto:/i, "").trim()
  );
}

function cleanEmails(emails: string[]) {
  return [...new Set(emails)]
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.includes("@"))
    .filter((email) => !email.includes("example.com"))
    .filter((email) => !email.includes(".png"))
    .filter((email) => !email.includes(".jpg"))
    .filter((email) => !email.includes(".jpeg"))
    .filter((email) => !email.includes(".webp"))
    .filter((email) => !email.includes(".svg"))
    .filter((email) => !email.includes("sentry"))
    .filter((email) => !email.includes("wixpress"))
    .filter((email) => !email.includes("domain.com"))
    .slice(0, 3);
}

async function fetchPage(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PilakoBot/1.0; +https://pilako.com)",
        Accept: "text/html,application/xhtml+xml",
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
          return {
            ...lead,
            email: lead.email || "Not found",
          };
        }

        const root = baseUrl.replace(/\/$/, "");

        const pagesToCheck = [
          root,
          `${root}/contact`,
          `${root}/contact-us`,
          `${root}/contacts`,
          `${root}/about`,
          `${root}/about-us`,
          `${root}/team`,
          `${root}/our-team`,
          `${root}/company`,
          `${root}/support`,
          `${root}/help`,
        ];

        let foundEmails: string[] = [];

        for (const page of pagesToCheck) {
          const html = await fetchPage(page);

          if (!html) continue;

          const emails = cleanEmails([
            ...extractEmails(html),
            ...extractMailto(html),
          ]);

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