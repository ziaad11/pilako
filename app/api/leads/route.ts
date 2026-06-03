import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { niche, location } = await req.json();

    const query = `${niche} ${location}`;

    const url =
      `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(
        query
      )}&api_key=${process.env.SERPAPI_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const leads =
      data.local_results?.slice(0, 20).map((item: any, index: number) => ({
        id: Date.now() + index,
        company: item.title || "Unknown",
        website: item.website || "Not found",
        email: "Not found",
        phone: item.phone || "Not found",
        location: item.address || "Not found",
        score: item.rating ? `${item.rating}/5` : "N/A",
      })) || [];

    return NextResponse.json({ leads });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}